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
// current user fetch as in the app.
async function renderForIdentity(hasPassword: boolean) {
  seedAccessToken('session-token');
  mockedApi.getCurrentIdentity.mockResolvedValue({
    data: {
      id: 'user-id',
      role: UserRoles.CANDIDATE,
      onboardingStatus: OnboardingStatus.NOT_STARTED,
      hasPassword,
    },
  } as any);
  const replace = jest.fn();
  mockUseRouter.mockReturnValue({ replace, asPath: '/backoffice/dashboard' });

  const store = createTestStore();
  await act(async () => {
    store.dispatch(currentUserActions.fetchUserRequested());
    await flushPromises();
  });

  const { result } = renderHook(
    () =>
      useOnboardingRedirect({
        currentUser: selectCurrentUser(store.getState()),
      }),
    { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> }
  );
  return { replace, result };
}

describe('useOnboardingRedirect', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('sends an account with an unfinished onboarding to the wizard', async () => {
    const { replace } = await renderForIdentity(true);

    expect(replace).toHaveBeenCalledWith('/wizard/run');
  });

  it('leaves the navigation to the password setup while the account has no password', async () => {
    const { replace, result } = await renderForIdentity(false);

    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isOnboardingRouteReady).toBe(true);
  });
});
