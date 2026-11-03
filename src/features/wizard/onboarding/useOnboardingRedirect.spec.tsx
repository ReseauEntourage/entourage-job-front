jest.mock('@/src/api');

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { act, cleanup, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import {
  currentUserActions,
  selectCurrentUser,
} from '@/src/use-cases/current-user';
import { OnboardingStatus } from './onboarding.constants';
import { useOnboardingRedirect } from './useOnboardingRedirect';

const mockedApi = getMockedApi();
const mockUseRouter = useRouter as jest.Mock;

// Loads the identity through the real fetch, so that the hook sees a finished
// current user fetch as in the app. `router.asPath` can be changed between
// rerenders to simulate in-app navigations.
async function renderForIdentity({
  hasPassword = true,
  role = UserRoles.CANDIDATE,
  onboardingStatus = OnboardingStatus.NOT_STARTED,
  asPath = '/backoffice/dashboard',
}: {
  hasPassword?: boolean;
  role?: UserRoles;
  onboardingStatus?: OnboardingStatus;
  asPath?: string;
} = {}) {
  seedAccessToken('session-token');
  mockedApi.getCurrentIdentity.mockResolvedValue({
    data: {
      id: 'user-id',
      role,
      onboardingStatus,
      hasPassword,
    },
  } as any);
  const replace = jest.fn();
  const router = { replace, asPath };
  mockUseRouter.mockImplementation(() => router);

  const store = createTestStore();
  await act(async () => {
    store.dispatch(currentUserActions.fetchUserRequested());
    await flushPromises();
  });

  const { result, rerender } = renderHook(
    () =>
      useOnboardingRedirect({
        currentUser: selectCurrentUser(store.getState()),
      }),
    { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> }
  );

  const navigate = async (path: string) => {
    router.asPath = path;
    await act(async () => {
      rerender();
      await flushPromises();
    });
  };

  return { replace, result, navigate };
}

const wizardRedirection = (requestedPath: string) => ({
  pathname: '/wizard/run',
  query: { requestedPath },
});

describe('useOnboardingRedirect', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('sends an account with an unfinished onboarding to the wizard, with the requested page', async () => {
    const { replace } = await renderForIdentity();

    expect(replace).toHaveBeenCalledWith(
      wizardRedirection('/backoffice/dashboard')
    );
  });

  it('keeps the requested page when sent away from the events page', async () => {
    const { replace } = await renderForIdentity({
      asPath: '/backoffice/events',
    });

    expect(replace).toHaveBeenCalledWith(
      wizardRedirection('/backoffice/events')
    );
  });

  it('redirects again on a second in-app navigation after leaving the wizard', async () => {
    const { replace, navigate } = await renderForIdentity({
      asPath: '/backoffice/events',
    });
    expect(replace).toHaveBeenCalledTimes(1);

    // The redirection lands on the wizard, then the user leaves it through
    // the logo (public home page), then opens the dashboard in-app.
    await navigate('/wizard/run?requestedPath=%2Fbackoffice%2Fevents');
    await navigate('/');
    expect(replace).toHaveBeenCalledTimes(1);

    await navigate('/backoffice/dashboard');
    expect(replace).toHaveBeenCalledTimes(2);
    expect(replace).toHaveBeenLastCalledWith(
      wizardRedirection('/backoffice/dashboard')
    );
  });

  it('does not redirect from the wizard opened with a requested page', async () => {
    const { replace, result } = await renderForIdentity({
      asPath: '/wizard/run?requestedPath=%2Fbackoffice%2Fevents',
    });

    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isOnboardingRouteReady).toBe(true);
  });

  it('does not redirect an exempted role', async () => {
    const { replace, result } = await renderForIdentity({
      role: UserRoles.REFERER,
      asPath: '/backoffice/events',
    });

    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isOnboardingRouteReady).toBe(true);
  });

  it('does not redirect once the onboarding is completed', async () => {
    const { replace, result } = await renderForIdentity({
      onboardingStatus: OnboardingStatus.COMPLETED,
      asPath: '/backoffice/events',
    });

    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isOnboardingRouteReady).toBe(true);
  });

  it('leaves the navigation to the password setup while the account has no password', async () => {
    const { replace, result } = await renderForIdentity({ hasPassword: false });

    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isOnboardingRouteReady).toBe(true);
  });
});
