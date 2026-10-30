// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { getDefaultUrl } from './Redirects';

describe('getDefaultUrl', () => {
  [
    UserRoles.ADMIN,
    UserRoles.CANDIDATE,
    UserRoles.COACH,
    UserRoles.REFERER,
  ].forEach((role) => {
    it(`sends ${role} to the dashboard`, () => {
      expect(getDefaultUrl(role)).toBe('/backoffice/dashboard');
    });
  });
});
