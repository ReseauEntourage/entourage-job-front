import '@testing-library/jest-dom';
import { fireEvent, screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { User } from '@/src/api/types';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { NavConnectedContentDesktop } from '../NavConnectedContent.desktop';
import { NavConnectedContentMobile } from '../NavConnectedContent.mobile';
import { renderLinks } from '../NavConnectedContent.utils';

const mockPush = jest.fn();
let mockUser: User;
let mockAsPath = '/backoffice/dashboard';

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush, asPath: mockAsPath }),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => mockUser,
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => ({ hasPicture: false }),
}));
jest.mock('@/src/features/notifications-center', () => ({
  NotificationsBell: () => null,
}));

const badges = { messaging: 0, notifications: 0, reports: 0 };

const buildUser = (role: UserRoles, onboardingStatus = 'completed') =>
  ({
    id: 'user-id',
    firstName: 'Camille',
    lastName: 'Martin',
    role,
    zone: 'PARIS',
    onboardingStatus,
  }) as unknown as User;

const renderDesktop = (role: UserRoles, onboardingStatus?: string) => {
  mockUser = buildUser(role, onboardingStatus);
  const logout = jest.fn();
  const entries = renderLinks(mockUser, logout, null);
  renderWithProviders(
    <NavConnectedContentDesktop
      badges={badges}
      links={entries.links}
      administration={entries.administration}
      dropdown={entries.dropdown}
      messaging={entries.messaging}
    />
  );
  return { logout };
};

describe('NavConnectedContentDesktop - account menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the photo and an arrow, without "Bonjour"', () => {
    renderDesktop(UserRoles.CANDIDATE);
    expect(screen.queryByText(/Bonjour/)).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: 'Menu du compte' });
    expect(toggle).toHaveAttribute('id', 'nav-profile');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a menu with "Mon profil" then "Se déconnecter"', () => {
    renderDesktop(UserRoles.CANDIDATE);
    fireEvent.click(screen.getByRole('button', { name: 'Menu du compte' }));
    const menu = screen.getByRole('menu');
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent)
    ).toEqual(['Mon profil', 'Se déconnecter']);
    // Each entry carries its icon
    within(menu)
      .getAllByRole('menuitem')
      .forEach((item) => {
        expect(item.querySelector('svg')).not.toBeNull();
      });
  });

  it('opens the profile page from the menu', () => {
    renderDesktop(UserRoles.CANDIDATE);
    fireEvent.click(screen.getByRole('button', { name: 'Menu du compte' }));
    fireEvent.click(screen.getByText('Mon profil'));
    expect(mockPush).toHaveBeenCalledWith('/backoffice/parametres');
  });

  it('logs out from the menu', () => {
    const { logout } = renderDesktop(UserRoles.COACH);
    fireEvent.click(screen.getByRole('button', { name: 'Menu du compte' }));
    fireEvent.click(screen.getByText('Se déconnecter'));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('keeps "Mon profil" out of the tab bar and names the first tab "Accueil"', () => {
    renderDesktop(UserRoles.REFERER);
    const tabs = Array.from(document.querySelectorAll('.menu-link')).map(
      (tab) => tab.textContent
    );
    expect(tabs[0]).toBe('Accueil');
    expect(tabs).not.toContain('Mon profil');
    expect(tabs).not.toContain('Tableau de bord');
  });

  it('only offers "Se déconnecter" while the onboarding is not completed', () => {
    renderDesktop(UserRoles.CANDIDATE, 'in_progress');
    fireEvent.click(screen.getByRole('button', { name: 'Menu du compte' }));
    expect(
      screen.getAllByRole('menuitem').map((item) => item.textContent)
    ).toEqual(['Se déconnecter']);
  });
});

const renderMobile = (
  role: UserRoles,
  options: {
    asPath?: string;
    onboardingStatus?: string;
    mobileBadges?: typeof badges;
  } = {}
) => {
  const { asPath, onboardingStatus, mobileBadges } = options;
  mockAsPath = asPath || '/backoffice/dashboard';
  mockUser = buildUser(role, onboardingStatus);
  const logout = jest.fn();
  const entries = renderLinks(mockUser, logout, null);
  renderWithProviders(
    <NavConnectedContentMobile
      badges={mobileBadges || badges}
      links={entries.links}
      administration={entries.administration}
      dropdown={entries.dropdown}
      messaging={entries.messaging}
    />
  );
  return { logout };
};

const openMobileMenu = () =>
  fireEvent.click(screen.getByTestId('nav-hamburger'));

describe('NavConnectedContentMobile - menu card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAsPath = '/backoffice/dashboard';
  });

  it('keeps the card closed until the hamburger is pressed', () => {
    renderMobile(UserRoles.CANDIDATE);
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
    openMobileMenu();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.queryByText('Tableau de bord')).not.toBeInTheDocument();
  });

  it('closes the card when the hamburger is pressed again', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    openMobileMenu();
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
  });

  it('closes the card on a press outside of it', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
  });

  it('keeps the card open on a press inside of it', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    fireEvent.mouseDown(screen.getByText('Accueil'));
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  });

  it('closes the card on Escape', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Accueil')).not.toBeInTheDocument();
  });

  it('closes the card once an entry is chosen', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    fireEvent.click(screen.getByText('Événements'));
    expect(screen.queryByText("Réseau d'entraide")).not.toBeInTheDocument();
  });

  it('leaves a 2px gap between the entries', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    const list = screen.getByRole('link', { name: 'Accueil' }).closest('ul');
    expect(list).toHaveStyle('gap: 2px');
  });

  it('offers real links', () => {
    renderMobile(UserRoles.CANDIDATE);
    openMobileMenu();
    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveAttribute(
      'href',
      '/backoffice/dashboard'
    );
  });

  it('has no "Messages" entry: the messaging stays in the bar', () => {
    renderMobile(UserRoles.COACH, {
      mobileBadges: { messaging: 3, notifications: 0, reports: 0 },
    });
    openMobileMenu();
    expect(screen.queryByText('Messages')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Messages' }).closest('a')
    ).toHaveAttribute('href', '/backoffice/messaging');
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  describe('current page', () => {
    it('fills the pill of the current entry only', () => {
      renderMobile(UserRoles.COACH, { asPath: '/backoffice/events' });
      openMobileMenu();
      expect(screen.getByRole('link', { name: 'Événements' })).toHaveStyle(
        `background-color: ${COLORS.primaryBlue}`
      );
      expect(screen.getByRole('link', { name: 'Accueil' })).not.toHaveStyle(
        `background-color: ${COLORS.primaryBlue}`
      );
    });

    it('keeps the entry active on one of its sub pages', () => {
      renderMobile(UserRoles.COACH, { asPath: '/backoffice/events/42' });
      openMobileMenu();
      expect(screen.getByRole('link', { name: 'Événements' })).toHaveStyle(
        `background-color: ${COLORS.primaryBlue}`
      );
    });
  });

  describe('folded groups', () => {
    it('folds "Ressources" by default and unfolds it on click', () => {
      renderMobile(UserRoles.COACH);
      openMobileMenu();
      const toggle = screen.getByRole('button', { name: 'Ressources' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Formations')).not.toBeInTheDocument();
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Formations')).toBeInTheDocument();
      fireEvent.click(toggle);
      expect(screen.queryByText('Formations')).not.toBeInTheDocument();
    });

    it('opens by itself when the current page is one of its entries', () => {
      renderMobile(UserRoles.COACH, {
        asPath: '/backoffice/ressources/formations',
      });
      openMobileMenu();
      expect(
        screen.getByRole('button', { name: 'Ressources' })
      ).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('link', { name: 'Formations' })).toHaveStyle(
        `background-color: ${COLORS.primaryBlue}`
      );
      // The parent is only tinted, the pill belongs to the sub entry
      expect(screen.getByRole('button', { name: 'Ressources' })).toHaveStyle(
        `background-color: ${COLORS.hoverBlue}`
      );
    });

    it('does not mark "Ressources" active because of an empty toolbox link', () => {
      renderMobile(UserRoles.COACH, { asPath: '/backoffice/events' });
      openMobileMenu();
      expect(
        screen.getByRole('button', { name: 'Ressources' })
      ).toHaveAttribute('aria-expanded', 'false');
    });

    it('keeps the reports badge visible on the folded "Administration"', () => {
      renderMobile(UserRoles.ADMIN, {
        mobileBadges: { messaging: 0, notifications: 0, reports: 4 },
      });
      openMobileMenu();
      const toggle = screen.getByRole('button', { name: /Administration/ });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(within(toggle).getByText('4')).toBeInTheDocument();
      expect(screen.queryByText('Les signalements')).not.toBeInTheDocument();
    });

    it('activates only the members entry matching the role filter', () => {
      renderMobile(UserRoles.ADMIN, {
        asPath: '/backoffice/admin/membres?role=Coach&zone=PARIS',
      });
      openMobileMenu();
      expect(screen.getByRole('link', { name: 'Les coachs' })).toHaveStyle(
        `background-color: ${COLORS.primaryBlue}`
      );
      expect(
        screen.getByRole('link', { name: 'Les candidats' })
      ).not.toHaveStyle(`background-color: ${COLORS.primaryBlue}`);
    });
  });

  describe('account menu', () => {
    it('is folded at the bottom of the card, behind the name', () => {
      renderMobile(UserRoles.CANDIDATE);
      openMobileMenu();
      const toggle = screen.getByTestId('nav-account');
      expect(toggle).toHaveTextContent('Camille Martin');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('Mon profil')).not.toBeInTheDocument();
      expect(screen.queryByText('Se déconnecter')).not.toBeInTheDocument();
    });

    it('unfolds on click and offers the profile and the logout', () => {
      const { logout } = renderMobile(UserRoles.CANDIDATE);
      openMobileMenu();
      fireEvent.click(screen.getByTestId('nav-account'));
      expect(screen.getByRole('link', { name: 'Mon profil' })).toHaveAttribute(
        'href',
        '/backoffice/parametres'
      );
      fireEvent.click(screen.getByRole('button', { name: 'Se déconnecter' }));
      expect(logout).toHaveBeenCalledTimes(1);
    });

    it('only offers "Se déconnecter" while the onboarding is not completed', () => {
      renderMobile(UserRoles.CANDIDATE, { onboardingStatus: 'in_progress' });
      openMobileMenu();
      fireEvent.click(screen.getByTestId('nav-account'));
      expect(screen.queryByText('Mon profil')).not.toBeInTheDocument();
      expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
    });
  });
});

describe('NavConnectedContent - admin home, logo and external icon', () => {
  const saved = {
    coach: process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL,
    candidate: process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL,
    company: process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL,
  };

  beforeAll(() => {
    process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL = 'https://toolbox.test/coachs';
    process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL =
      'https://toolbox.test/candidats';
    process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL =
      'https://toolbox.test/entreprises';
  });

  afterAll(() => {
    const restore = (key: string, value?: string) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    };
    restore('NEXT_PUBLIC_TOOLBOX_COACH_URL', saved.coach);
    restore('NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL', saved.candidate);
    restore('NEXT_PUBLIC_TOOLBOX_COMPANY_URL', saved.company);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockAsPath = '/backoffice/dashboard';
  });

  const getLogoLink = () =>
    document.querySelector('a.uk-margin-small-left') as HTMLElement;

  describe('on desktop', () => {
    it('names the first tab of the admin "Accueil"', () => {
      renderDesktop(UserRoles.ADMIN);
      const tabs = Array.from(document.querySelectorAll('.menu-link')).map(
        (tab) => tab.textContent
      );
      expect(tabs[0]).toBe('Accueil');
      expect(tabs).toContain('Ressources');
    });

    it('leads the logo of the admin to the dashboard', () => {
      renderDesktop(UserRoles.ADMIN);
      expect(getLogoLink()).toHaveAttribute('href', '/backoffice/dashboard');
    });

    it('puts the external icon on the three toolboxes of the admin only', () => {
      renderDesktop(UserRoles.ADMIN);
      const items = Array.from(document.querySelectorAll('.subMenu-item'));
      const withIcon = items.filter((item) =>
        item.querySelector('[data-testid="nav-external-icon"]')
      );
      expect(withIcon.map((item) => item.textContent)).toEqual([
        "Boîte à outils coachs(s'ouvre dans un nouvel onglet)",
        "Boîte à outils candidats(s'ouvre dans un nouvel onglet)",
        "Boîte à outils entreprises(s'ouvre dans un nouvel onglet)",
      ]);
      expect(
        items.find((item) => item.textContent === "Structures de l'inclusion")
      ).toBeDefined();
    });

    [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach(
      (role) => {
        it(`puts the external icon on the toolbox of a ${role}, not on the other entries`, () => {
          renderDesktop(role);
          const items = Array.from(document.querySelectorAll('.subMenu-item'));
          const withIcon = items.filter((item) =>
            item.querySelector('[data-testid="nav-external-icon"]')
          );
          expect(withIcon).toHaveLength(1);
          expect(withIcon[0].textContent).toMatch(/^Boîte à outils/);
        });
      }
    );

    it('hides the icon from assistive technologies and announces the new tab', () => {
      renderDesktop(UserRoles.ADMIN);
      const icon = document.querySelector(
        '[data-testid="nav-external-icon"]'
      ) as HTMLElement;
      expect(icon.querySelector('[aria-hidden="true"]')).not.toBeNull();
      expect(icon).toHaveTextContent("(s'ouvre dans un nouvel onglet)");
    });
  });

  describe('on mobile', () => {
    it('shows "Accueil" and a folded "Ressources" to the admin', () => {
      renderMobile(UserRoles.ADMIN);
      openMobileMenu();
      expect(screen.getByRole('link', { name: 'Accueil' })).toHaveAttribute(
        'href',
        '/backoffice/dashboard'
      );
      expect(
        screen.getByRole('button', { name: 'Ressources' })
      ).toHaveAttribute('aria-expanded', 'false');
      expect(
        screen.queryByText('Boîte à outils coachs')
      ).not.toBeInTheDocument();
    });

    it('leads the logo of the admin to the dashboard', () => {
      renderMobile(UserRoles.ADMIN);
      expect(getLogoLink()).toHaveAttribute('href', '/backoffice/dashboard');
    });

    it('unfolds "Ressources" on the three toolboxes, each with the external icon', () => {
      renderMobile(UserRoles.ADMIN);
      openMobileMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Ressources' }));
      const toolboxes = [
        'Boîte à outils coachs',
        'Boîte à outils candidats',
        'Boîte à outils entreprises',
      ];
      toolboxes.forEach((name) => {
        const link = screen.getByRole('link', { name: new RegExp(name) });
        expect(link).toHaveAttribute('target', '_blank');
        expect(
          within(link).getByTestId('nav-external-icon')
        ).toBeInTheDocument();
      });
      const structures = screen.getByRole('link', {
        name: "Structures de l'inclusion",
      });
      expect(
        within(structures).queryByTestId('nav-external-icon')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Formations' })
      ).not.toBeInTheDocument();
    });

    it('puts the external icon on the toolbox of a coach too', () => {
      renderMobile(UserRoles.COACH);
      openMobileMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Ressources' }));
      const link = screen.getByRole('link', {
        name: /Boîte à outils/,
      });
      expect(within(link).getByTestId('nav-external-icon')).toBeInTheDocument();
    });
  });
});
