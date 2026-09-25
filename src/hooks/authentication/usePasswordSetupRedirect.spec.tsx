jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { cleanup, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { User } from '@/src/api/types';
import {
  FINALIZE_ACCOUNT_PATH,
  usePasswordSetupRedirect,
} from './usePasswordSetupRedirect';

const mockUseRouter = useRouter as jest.Mock;

const mockRouter = (pathname: string, asPath: string) => {
  const replace = jest.fn();
  mockUseRouter.mockReturnValue({ replace, pathname, asPath });
  return replace;
};

const user = (hasPassword: boolean | undefined) =>
  ({ id: 'user-id', hasPassword }) as User;

describe('usePasswordSetupRedirect', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('sends an account without a password to the finalize page, keeping the requested page without the autologin token', () => {
    const replace = mockRouter(
      '/backoffice/messaging',
      '/backoffice/messaging?userId=author&autologinToken=abc.def'
    );

    const { result } = renderHook(() =>
      usePasswordSetupRedirect({ currentUser: user(false) })
    );

    expect(result.current.isPasswordSetupRouteReady).toBe(false);
    expect(replace).toHaveBeenCalledWith({
      pathname: FINALIZE_ACCOUNT_PATH,
      query: { requestedPath: '/backoffice/messaging?userId=author' },
    });
  });

  it('keeps the fragment of the requested page apart from its query', () => {
    const replace = mockRouter(
      '/backoffice/messaging',
      '/backoffice/messaging?userId=author&autologinToken=abc.def#last'
    );

    renderHook(() => usePasswordSetupRedirect({ currentUser: user(false) }));

    expect(replace).toHaveBeenCalledWith({
      pathname: FINALIZE_ACCOUNT_PATH,
      query: { requestedPath: '/backoffice/messaging?userId=author#last' },
    });
  });

  it('does not redirect in a loop from the finalize page itself', () => {
    const replace = mockRouter(
      FINALIZE_ACCOUNT_PATH,
      `${FINALIZE_ACCOUNT_PATH}?requestedPath=%2Fbackoffice`
    );

    const { result } = renderHook(() =>
      usePasswordSetupRedirect({ currentUser: user(false) })
    );

    expect(result.current.isPasswordSetupRouteReady).toBe(true);
    expect(replace).not.toHaveBeenCalled();
  });

  (
    [
      ['an account with a password', user(true)],
      ['an identity without the flag', user(undefined)],
      ['no authenticated user', null],
    ] as const
  ).forEach(([label, currentUser]) => {
    it(`leaves ${label} alone`, () => {
      const replace = mockRouter(
        '/backoffice/dashboard',
        '/backoffice/dashboard'
      );

      const { result } = renderHook(() =>
        usePasswordSetupRedirect({ currentUser })
      );

      expect(result.current.isPasswordSetupRouteReady).toBe(true);
      expect(replace).not.toHaveBeenCalled();
    });
  });
});
