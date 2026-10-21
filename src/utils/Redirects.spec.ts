// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { getDefaultUrl } from './Redirects';

describe('getDefaultUrl', () => {
  it('sends admins to the members back office', () => {
    expect(getDefaultUrl(UserRoles.ADMIN)).toBe('/backoffice/admin/membres');
  });

  [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach((role) => {
    it(`sends ${role} to the dashboard`, () => {
      expect(getDefaultUrl(role)).toBe('/backoffice/dashboard');
    });
  });
});
