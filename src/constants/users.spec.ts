// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles, isCoachLikeRole } from './users';

describe('isCoachLikeRole', () => {
  it('treats coaches and admins as coach-like', () => {
    expect(isCoachLikeRole(UserRoles.COACH)).toBe(true);
    expect(isCoachLikeRole(UserRoles.ADMIN)).toBe(true);
  });

  it('does not treat candidates and referers as coach-like', () => {
    expect(isCoachLikeRole(UserRoles.CANDIDATE)).toBe(false);
    expect(isCoachLikeRole(UserRoles.REFERER)).toBe(false);
  });
});
