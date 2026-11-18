// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CurrentUserCompany, User } from '@/src/api/types';
import { GA_TAGS } from '@/src/constants/tags';
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
      'Les signalements',
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
      '/backoffice/admin/signalements',
    ]);
  });

  it('puts the reports badge on "Les signalements" and on the cog', () => {
    const administration = getAdministration(UserRoles.ADMIN);
    expect(
      administration?.subMenu?.find(({ name }) => name === 'Les signalements')
        ?.badge
    ).toBe('reports');
    expect(administration?.badge).toBe('reports');
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
      'Accueil',
      "Réseau d'entraide",
      'Groupes',
      'Événements',
      'Ressources',
    ]);
  });

  [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach((role) => {
    it(`shows no "Administration" menu to a ${role}`, () => {
      expect(getAdministration(role)).toBeNull();
      expect(getNames(role)).not.toContain('Les groupes');
    });
  });
});

describe('NavConnectedContent.utils - account menu and home entry', () => {
  const getDropdownNames = (role: UserRoles, onboardingStatus?: string) =>
    renderLinks(
      buildUser(role, onboardingStatus),
      jest.fn(),
      null
    ).dropdown.map(({ name }) => name);

  [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach((role) => {
    it(`names the first tab "Accueil" for ${role}`, () => {
      expect(getNames(role)[0]).toBe('Accueil');
      expect(getNames(role)).not.toContain('Tableau de bord');
    });
  });

  it('gives the admin an "Accueil" tab to the dashboard, as first tab', () => {
    expect(getNames(UserRoles.ADMIN)[0]).toBe('Accueil');
    const entry = renderLinks(buildUser(UserRoles.ADMIN), jest.fn(), null)
      .links[UserRoles.ADMIN][0];
    expect(entry.href).toBe('/backoffice/dashboard');
    expect(entry.tag).toBe(GA_TAGS.BACKOFFICE_ADMIN_HEADER_DASHBOARD_CLIC);
  });

  [
    UserRoles.CANDIDATE,
    UserRoles.COACH,
    UserRoles.REFERER,
    UserRoles.ADMIN,
  ].forEach((role) => {
    it(`keeps "Mon profil" out of the tabs for ${role}`, () => {
      expect(getNames(role)).not.toContain('Mon profil');
    });

    it(`puts "Mon profil" before "Se déconnecter" in the account menu for ${role}`, () => {
      expect(getDropdownNames(role)).toEqual(['Mon profil', 'Se déconnecter']);
    });
  });

  it('links "Mon profil" to the profile page', () => {
    const entry = renderLinks(
      buildUser(UserRoles.CANDIDATE),
      jest.fn(),
      null
    ).dropdown.find(({ name }) => name === 'Mon profil');
    expect(entry?.href).toBe('/backoffice/parametres');
  });

  it('shows "Se déconnecter" in darkOrange and calls logout', () => {
    const logout = jest.fn();
    const entry = renderLinks(
      buildUser(UserRoles.COACH),
      logout,
      null
    ).dropdown.find(({ name }) => name === 'Se déconnecter');
    expect(entry?.color).toBe('darkOrange');
    entry?.onClick?.();
    expect(logout).toHaveBeenCalledTimes(1);
  });

  [UserRoles.CANDIDATE, UserRoles.COACH].forEach((role) => {
    ['not_started', 'in_progress'].forEach((status) => {
      it(`only offers "Se déconnecter" to a ${role} whose onboarding is ${status}`, () => {
        expect(getDropdownNames(role, status)).toEqual(['Se déconnecter']);
      });
    });
  });
});

describe('NavConnectedContent.utils - admin "Ressources" menu', () => {
  const COACH_URL = 'https://toolbox.test/coachs';
  const CANDIDATE_URL = 'https://toolbox.test/candidats';
  const COMPANY_URL = 'https://toolbox.test/entreprises';
  const saved = {
    coach: process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL,
    candidate: process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL,
    company: process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL,
  };

  const restore = (key: string, value?: string) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL = COACH_URL;
    process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL = CANDIDATE_URL;
    process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL = COMPANY_URL;
  });

  afterAll(() => {
    restore('NEXT_PUBLIC_TOOLBOX_COACH_URL', saved.coach);
    restore('NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL', saved.candidate);
    restore('NEXT_PUBLIC_TOOLBOX_COMPANY_URL', saved.company);
  });

  const getResources = (role = UserRoles.ADMIN) =>
    renderLinks(buildUser(role), jest.fn(), null).links[role].find(
      ({ name }) => name === 'Ressources'
    );

  it('lists the three toolboxes then "Structures de l\'inclusion", without "Formations"', () => {
    const names = getResources()?.subMenu?.map(({ name }) => name);
    expect(names).toEqual([
      'Boîte à outils coachs',
      'Boîte à outils candidats',
      'Boîte à outils entreprises',
      "Structures de l'inclusion",
    ]);
    expect(names).not.toContain('Formations');
  });

  it('opens each toolbox in a new tab towards its own address', () => {
    const toolboxes = getResources()?.subMenu?.slice(0, 3);
    expect(toolboxes?.map(({ href }) => href)).toEqual([
      COACH_URL,
      CANDIDATE_URL,
      COMPANY_URL,
    ]);
    expect(toolboxes?.every(({ external }) => external === true)).toBe(true);
    expect(toolboxes?.map(({ tag }) => tag)).toEqual([
      GA_TAGS.BACKOFFICE_ADMIN_HEADER_BAO_COACH_CLIC,
      GA_TAGS.BACKOFFICE_ADMIN_HEADER_BAO_CANDIDAT_CLIC,
      GA_TAGS.BACKOFFICE_ADMIN_HEADER_BAO_COMPANY_CLIC,
    ]);
  });

  it('opens "Structures de l\'inclusion" in the app, not in a new tab', () => {
    const structures = getResources()?.subMenu?.[3];
    expect(structures?.href).toBe('/backoffice/ressources/aides-locales');
    expect(structures?.external).toBeFalsy();
  });

  [
    ['NEXT_PUBLIC_TOOLBOX_COACH_URL', 'Boîte à outils coachs'],
    ['NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL', 'Boîte à outils candidats'],
    ['NEXT_PUBLIC_TOOLBOX_COMPANY_URL', 'Boîte à outils entreprises'],
  ].forEach(([variable, label]) => {
    it(`leaves "${label}" out when ${variable} is not set, and keeps the others`, () => {
      delete process.env[variable];
      const names = getResources()?.subMenu?.map(({ name }) => name);
      expect(names).not.toContain(label);
      expect(names).toHaveLength(3);
      expect(names).toContain("Structures de l'inclusion");
    });

    it(`leaves "${label}" out when ${variable} is empty`, () => {
      process.env[variable] = '';
      expect(getResources()?.subMenu?.map(({ name }) => name)).not.toContain(
        label
      );
    });
  });

  it('keeps "Structures de l\'inclusion" when no toolbox address is set', () => {
    delete process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL;
    delete process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL;
    delete process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL;
    expect(getResources()?.subMenu?.map(({ name }) => name)).toEqual([
      "Structures de l'inclusion",
    ]);
  });

  it('does not touch the "Ressources" menu of the other roles', () => {
    [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach(
      (role) => {
        const names = getResources(role)?.subMenu?.map(({ name }) => name);
        expect(names).not.toContain('Boîte à outils coachs');
        expect(names).toContain("Structures de l'inclusion");
      }
    );
  });
});
