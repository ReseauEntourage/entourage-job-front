// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CurrentUserCompany, User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { renderLinks } from '../NavConnectedContent.utils';

const buildUser = (role: UserRoles, onboardingStatus = 'completed') =>
  ({ id: 'user-id', role, zone: 'PARIS', onboardingStatus }) as unknown as User;

const getNames = (
  role: UserRoles,
  onboardingStatus?: string,
  company: CurrentUserCompany | null = null
) =>
  renderLinks(buildUser(role, onboardingStatus), jest.fn(), company).links[
    role
  ].map(({ name }) => name);

describe('NavConnectedContent.utils - help groups entries', () => {
  [
    UserRoles.CANDIDATE,
    UserRoles.COACH,
    UserRoles.REFERER,
    UserRoles.ADMIN,
  ].forEach((role) => {
    it(`puts "Groupes" right after "Réseau d'entraide" for ${role}`, () => {
      const names = getNames(role);
      const networkIndex = names.indexOf("Réseau d'entraide");
      expect(networkIndex).toBeGreaterThanOrEqual(0);
      expect(names[networkIndex + 1]).toBe('Groupes');
      // "Événements" keeps its place right after the new entry
      expect(names[networkIndex + 2]).toBe('Événements');
    });
  });

  it('puts "Groupes" after "Réseau d\'entraide" for a company admin coach', () => {
    const company = {
      companyUser: { isAdmin: true },
    } as unknown as CurrentUserCompany;
    const names = getNames(UserRoles.COACH, 'completed', company);
    expect(names).toContain('Mon entreprise');
    expect(names[names.indexOf("Réseau d'entraide") + 1]).toBe('Groupes');
  });

  it('links "Groupes" to the groups list', () => {
    const groupsItem = renderLinks(
      buildUser(UserRoles.CANDIDATE),
      jest.fn(),
      null
    ).links[UserRoles.CANDIDATE].find(({ name }) => name === 'Groupes');
    expect(groupsItem?.href).toBe('/backoffice/groupes');
  });

  [UserRoles.CANDIDATE, UserRoles.COACH].forEach((role) => {
    it(`hides "Groupes" for a ${role} whose onboarding is not completed`, () => {
      expect(getNames(role, 'in_progress')).not.toContain('Groupes');
    });
  });

  it('puts the admin entry "Les groupes" right after "Les structures partenaires"', () => {
    const items = renderLinks(buildUser(UserRoles.ADMIN), jest.fn(), null)
      .links[UserRoles.ADMIN];
    const names = items.map(({ name }) => name);
    const index = names.indexOf('Les structures partenaires');
    expect(names[index + 1]).toBe('Les groupes');
    expect(items[index + 1].href).toBe('/backoffice/admin/groupes');
  });

  [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach((role) => {
    it(`does not show "Les groupes" to a ${role}`, () => {
      expect(getNames(role)).not.toContain('Les groupes');
    });
  });
});
