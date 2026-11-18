import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { currentUserActions } from '@/src/use-cases/current-user';
import { getDefaultUrl } from '@/src/utils/Redirects';
import { authenticatedPermissions } from './permissions';
import { useRoutePermissions } from './useRoutePermissions';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockUseRouter = useRouter as jest.Mock;

const isAuthorized = (pathname: string, role?: UserRoles) => {
  mockUseRouter.mockReturnValue({ pathname });
  const store = createTestStore();
  if (role) {
    store.dispatch(
      currentUserActions.fetchUserSucceeded({ id: 'u', role } as User)
    );
  }
  return renderHook(() => useRoutePermissions(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  }).result.current.isUserAuthorized;
};

describe('useRoutePermissions', () => {
  it('lets anyone reach a public route', () => {
    expect(isAuthorized('/login')).toBe(true);
    expect(isAuthorized('/', UserRoles.COACH)).toBe(true);
  });

  it('rejects anonymous users on protected routes', () => {
    expect(isAuthorized('/backoffice/dashboard')).toBe(false);
    expect(isAuthorized('/backoffice/parametres')).toBe(false);
  });

  it('lets every authenticated role reach "*" routes', () => {
    [
      UserRoles.ADMIN,
      UserRoles.CANDIDATE,
      UserRoles.COACH,
      UserRoles.REFERER,
    ].forEach((role) => {
      expect(isAuthorized('/backoffice/parametres', role)).toBe(true);
    });
  });

  it('lets every role reach the dashboard but not anonymous users', () => {
    expect(isAuthorized('/backoffice/dashboard', UserRoles.CANDIDATE)).toBe(
      true
    );
    expect(isAuthorized('/backoffice/dashboard', UserRoles.COACH)).toBe(true);
    expect(isAuthorized('/backoffice/dashboard', UserRoles.REFERER)).toBe(true);
    expect(isAuthorized('/backoffice/dashboard', UserRoles.ADMIN)).toBe(true);
    expect(isAuthorized('/backoffice/dashboard')).toBe(false);
  });

  it('keeps the candidate pages out of reach of admins', () => {
    expect(
      isAuthorized('/backoffice/candidat/[candidateId]', UserRoles.ADMIN)
    ).toBe(false);
    expect(
      isAuthorized('/backoffice/candidat/[candidateId]/cv', UserRoles.ADMIN)
    ).toBe(false);
    expect(
      isAuthorized('/backoffice/candidat/[candidateId]', UserRoles.COACH)
    ).toBe(true);
  });

  it('authorizes the default page of every role, so the redirect never loops', () => {
    [
      UserRoles.ADMIN,
      UserRoles.CANDIDATE,
      UserRoles.COACH,
      UserRoles.REFERER,
    ].forEach((role) => {
      expect(isAuthorized(getDefaultUrl(role), role)).toBe(true);
    });
  });

  it('restricts referer-only routes', () => {
    expect(isAuthorized('/backoffice/candidat/list', UserRoles.REFERER)).toBe(
      true
    );
    expect(isAuthorized('/backoffice/candidat/list', UserRoles.COACH)).toBe(
      false
    );
  });

  it('restricts admin routes by prefix', () => {
    expect(isAuthorized('/backoffice/admin/membres', UserRoles.ADMIN)).toBe(
      true
    );
    expect(isAuthorized('/backoffice/admin/membres', UserRoles.CANDIDATE)).toBe(
      false
    );
  });
});

describe('authenticatedPermissions', () => {
  it('declares either "*" or a non-empty role list for every rule', () => {
    authenticatedPermissions.forEach((rule) => {
      expect(rule.paths.length).toBeGreaterThan(0);
      expect(
        rule.roles === '*' ||
          (Array.isArray(rule.roles) && rule.roles.length > 0)
      ).toBe(true);
    });
  });

  it('only uses absolute backoffice paths', () => {
    authenticatedPermissions.forEach((rule) =>
      rule.paths.forEach((p) => expect(p.startsWith('/backoffice/')).toBe(true))
    );
  });
});
