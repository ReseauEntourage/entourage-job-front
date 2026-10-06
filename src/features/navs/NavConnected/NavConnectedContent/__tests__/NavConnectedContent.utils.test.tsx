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
  company: CurrentUserCompany | null = null,
  hasPublishedHelpGroups = true
) =>
  renderLinks(
    buildUser(role, onboardingStatus),
    jest.fn(),
    company,
    hasPublishedHelpGroups
  ).links[role].map(({ name }) => name);

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
      null,
      true
    ).links[UserRoles.CANDIDATE].find(({ name }) => name === 'Groupes');
    expect(groupsItem?.href).toBe('/backoffice/groupes');
  });

  [UserRoles.CANDIDATE, UserRoles.COACH].forEach((role) => {
    it(`hides "Groupes" for a ${role} whose onboarding is not completed`, () => {
      expect(getNames(role, 'in_progress')).not.toContain('Groupes');
    });
  });

  [
    UserRoles.CANDIDATE,
    UserRoles.COACH,
    UserRoles.REFERER,
    UserRoles.ADMIN,
  ].forEach((role) => {
    it(`hides "Groupes" for ${role} while no group is published`, () => {
      const names = getNames(role, 'completed', null, false);
      expect(names).not.toContain('Groupes');
      expect(names[names.indexOf("Réseau d'entraide") + 1]).toBe('Événements');
    });
  });

  const getAdministration = (role: UserRoles, hasPublishedHelpGroups = true) =>
    renderLinks(buildUser(role), jest.fn(), null, hasPublishedHelpGroups)
      .administration;

  it('gathers the admin pages in the "Administration" menu, in order', () => {
    const administration = getAdministration(UserRoles.ADMIN);
    expect(administration?.name).toBe('Administration');
    expect(administration?.subMenu?.map(({ name }) => name)).toEqual([
      'Les candidats',
      'Les coachs',
      'Les prescripteurs',
      'Les structures partenaires',
      'Les groupes',
    ]);
    expect(
      administration?.subMenu?.map(
        ({ href, queryParams }) => href + (queryParams || '')
      )
    ).toEqual([
      '/backoffice/admin/membres?role=Candidat&zone=PARIS',
      '/backoffice/admin/membres?role=Coach&zone=PARIS',
      '/backoffice/admin/membres?role=Prescripteur&zone=PARIS',
      '/backoffice/admin/structures?zone=PARIS',
      '/backoffice/admin/groupes',
    ]);
  });

  it('keeps "Les groupes" in the "Administration" menu while no group is published', () => {
    expect(
      getAdministration(UserRoles.ADMIN, false)?.subMenu?.map(
        ({ name }) => name
      )
    ).toContain('Les groupes');
  });

  it('leaves the admin pages out of the admin main menu', () => {
    expect(getNames(UserRoles.ADMIN)).toEqual([
      'Mon profil',
      "Réseau d'entraide",
      'Groupes',
      'Événements',
    ]);
  });

  [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach((role) => {
    it(`shows no "Administration" menu to a ${role}`, () => {
      expect(getAdministration(role)).toBeNull();
      expect(getNames(role)).not.toContain('Les groupes');
    });
  });
});
