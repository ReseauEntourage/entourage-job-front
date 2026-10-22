import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useNetworkDirectoryRedirection } from '../useNetworkDirectoryRedirection';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));

const replace = jest.fn();

const setup = ({
  role,
  query = {},
  profile = {},
}: {
  role: UserRoles;
  query?: Record<string, unknown>;
  profile?: Record<string, unknown> | null;
}) => {
  (useRouter as jest.Mock).mockReturnValue({ replace, query });
  (useAuthenticatedUser as jest.Mock).mockReturnValue({ role });
  (useCurrentUserProfile as jest.Mock).mockReturnValue(profile);
  return renderHook(() => useNetworkDirectoryRedirection());
};

describe('useNetworkDirectoryRedirection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does nothing until the profile is loaded', () => {
    setup({ role: UserRoles.CANDIDATE, profile: null });
    expect(replace).not.toHaveBeenCalled();
  });

  it('sends a candidate to the coaches, available only', () => {
    setup({ role: UserRoles.CANDIDATE });
    expect(replace).toHaveBeenCalledWith(
      {
        pathname: '/backoffice/annuaire',
        query: {
          entity: 'user',
          role: UserRoles.COACH,
          contactTypes: undefined,
          departments: undefined,
          isAvailable: true,
        },
      },
      undefined,
      { shallow: true }
    );
  });

  it('sends a coach (or anybody else) to the candidates', () => {
    [UserRoles.COACH, UserRoles.ADMIN].forEach((role) => {
      replace.mockClear();
      setup({ role });
      expect(replace.mock.calls[0][0].query.role).toBe(UserRoles.CANDIDATE);
    });
  });

  it('filters on remote contacts for a remote-only user', () => {
    setup({
      role: UserRoles.CANDIDATE,
      profile: { allowRemoteEvents: true, allowPhysicalEvents: false },
    });
    expect(replace.mock.calls[0][0].query).toMatchObject({
      contactTypes: [ContactTypeEnum.REMOTE],
      departments: undefined,
    });
  });

  it('filters on physical contacts and the department for a physical-only user', () => {
    setup({
      role: UserRoles.CANDIDATE,
      profile: {
        allowRemoteEvents: false,
        allowPhysicalEvents: true,
        department: 'Paris (75)',
      },
    });
    expect(replace.mock.calls[0][0].query).toMatchObject({
      contactTypes: [ContactTypeEnum.PHYSICAL],
      departments: ['Paris (75)'],
    });
  });

  it('does not filter when the user accepts both kinds of contact', () => {
    setup({
      role: UserRoles.CANDIDATE,
      profile: {
        allowRemoteEvents: true,
        allowPhysicalEvents: true,
        department: 'Paris (75)',
      },
    });
    expect(replace.mock.calls[0][0].query).toMatchObject({
      contactTypes: undefined,
      departments: undefined,
    });
  });

  it('only defaults isAvailable when role and entity are already in the URL', () => {
    setup({
      role: UserRoles.CANDIDATE,
      query: { role: UserRoles.COACH, entity: 'user', search: 'x' },
    });
    expect(replace.mock.calls[0][0].query).toEqual({
      role: UserRoles.COACH,
      entity: 'user',
      search: 'x',
      isAvailable: true,
    });
  });

  it('does not redirect when everything is already in the URL', () => {
    setup({
      role: UserRoles.CANDIDATE,
      query: { role: UserRoles.COACH, entity: 'user', isAvailable: 'false' },
    });
    expect(replace).not.toHaveBeenCalled();
  });

  it('defaults isAvailable only once, so unchecking it sticks', () => {
    const { rerender } = setup({
      role: UserRoles.CANDIDATE,
      query: { role: UserRoles.COACH, entity: 'user' },
    });
    expect(replace).toHaveBeenCalledTimes(1);
    // The filter was unchecked: isAvailable is removed from the URL
    (useRouter as jest.Mock).mockReturnValue({
      replace,
      query: { role: UserRoles.COACH, entity: 'user', search: 'y' },
    });
    rerender();
    expect(replace).toHaveBeenCalledTimes(1);
  });
});
