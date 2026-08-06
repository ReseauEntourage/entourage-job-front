jest.mock('@/src/api');

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

// The permissions logic itself isn't the concern of this test — always allow
// the route so the autologin interception can be observed in isolation.
jest.mock('./useRoutePermissions', () => ({
  useRoutePermissions: () => ({ isUserAuthorized: true }),
}));

import { act, cleanup, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';
import { STORAGE_KEYS } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { useAuthentication } from './useAuthentication';

const mockedApi = getMockedApi();
const mockUseRouter = useRouter as jest.Mock;

function renderWithStore(store: ReturnType<typeof createTestStore>) {
  return renderHook(() => useAuthentication(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
}

// Lets every pending microtask (mutation dispatch -> listener middleware ->
// RTK Query -> reducer -> re-render) settle inside `act`, so a still-pending
// update from one test can't bleed into the next test's render assertions.
async function settle() {
  await act(async () => {
    await flushPromises();
  });
}

describe('useAuthentication - autologin interception', () => {
  const replace = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockedApi.getCurrentIdentity.mockResolvedValue({
      data: { id: 'user-1', onboardingStatus: 'STARTED' },
    } as any);
  });

  // Each hook keeps its own effects/subscriptions running otherwise, and a
  // still-mounted previous test's `replace`/`push` calls (shared jest.fn
  // instances) would bleed into the next test's assertions.
  afterEach(() => {
    cleanup();
  });

  it('exchanges the autologin token for a session and strips it from the URL, without an eager unauthenticated fetch', async () => {
    mockUseRouter.mockReturnValue({
      replace,
      push,
      asPath: '/backoffice/messaging?userId=author&autologinToken=abc.def',
      query: { userId: 'author', autologinToken: 'abc.def' },
      isReady: true,
      pathname: '/backoffice/messaging',
    });
    mockedApi.postAuthAutologin.mockResolvedValue({
      data: { token: 'session-token' },
    } as any);

    const store = createTestStore();
    const { unmount } = renderWithStore(store);

    // The autologin exchange starts immediately, but the classic
    // unauthenticated fetchUser call must not fire while it's pending.
    expect(mockedApi.postAuthAutologin).toHaveBeenCalledWith({
      token: 'abc.def',
    });
    expect(mockedApi.getCurrentIdentity).not.toHaveBeenCalled();

    await settle();

    expect(store.getState().authentication.accessToken).toBe('session-token');
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe(
      'session-token'
    );
    expect(replace).toHaveBeenCalledWith(
      { pathname: '/backoffice/messaging', query: { userId: 'author' } },
      undefined,
      { shallow: true }
    );

    // Once the exchange is resolved, the guarded fetchUser effect is free to
    // run and picks up the freshly stored token.
    await settle();
    expect(mockedApi.getCurrentIdentity).toHaveBeenCalledTimes(1);

    // Let the chained fetchUser mutation itself fully resolve before
    // unmounting, so no listener effect from this test's store is still
    // in-flight when the next test starts (the listener middleware is a
    // singleton shared across every `createTestStore()` instance).
    await settle();
    unmount();
    await settle();
  });

  it('falls back to the normal unauthenticated flow when the token is invalid/expired/already used', async () => {
    mockUseRouter.mockReturnValue({
      replace,
      push,
      asPath: '/backoffice/messaging?userId=author&autologinToken=bad.token',
      query: { userId: 'author', autologinToken: 'bad.token' },
      isReady: true,
      pathname: '/backoffice/messaging',
    });
    mockedApi.postAuthAutologin.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: 'AUTOLOGIN_TOKEN_INVALID' } },
    });

    const store = createTestStore();
    const { unmount, rerender } = renderWithStore(store);

    await settle();
    await settle();
    // A render nudge: the mutation's rejection is fully reflected in the
    // store by this point (asserted below), but in this test file's
    // multi-store sequence React doesn't always re-run on its own — force
    // one so the URL-cleanup effect gets to observe the settled FAILED
    // status.
    rerender();
    await settle();

    expect(store.getState().authentication.accessToken).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    expect(replace).toHaveBeenCalledWith(
      { pathname: '/backoffice/messaging', query: { userId: 'author' } },
      undefined,
      { shallow: true }
    );

    unmount();
    await settle();
  });

  it('does not attempt an exchange when there is no autologin token in the URL', async () => {
    mockUseRouter.mockReturnValue({
      replace,
      push,
      asPath: '/backoffice/messaging?userId=author',
      query: { userId: 'author' },
      isReady: true,
      pathname: '/backoffice/messaging',
    });
    // `fetchUser`'s queryFn short-circuits to NOT_AUTHENTICATED without
    // calling the API when there's no access token — seed one so the
    // ordinary (non-autologin) idle-triggered fetch actually reaches it.
    seedAccessToken('already-logged-in-token');

    const store = createTestStore();
    const { unmount } = renderWithStore(store);
    await settle();
    await settle();

    expect(mockedApi.postAuthAutologin).not.toHaveBeenCalled();
    expect(mockedApi.getCurrentIdentity).toHaveBeenCalledTimes(1);

    unmount();
    await settle();
  });
});
