import '@testing-library/jest-dom';
import { fireEvent, screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { NavConnectedContentDesktop } from '../NavConnectedContent.desktop';
import { NavConnectedContentMobile } from '../NavConnectedContent.mobile';
import { renderLinks } from '../NavConnectedContent.utils';

const mockPush = jest.fn();
let mockUser: User;

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush, asPath: '/backoffice/dashboard' }),
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

describe('NavConnectedContentMobile - side panel', () => {
  it('lists "Accueil", "Mon profil" and "Se déconnecter", without "Tableau de bord"', () => {
    mockUser = buildUser(UserRoles.CANDIDATE);
    const entries = renderLinks(mockUser, jest.fn(), null);
    renderWithProviders(
      <NavConnectedContentMobile
        badges={badges}
        links={entries.links}
        administration={entries.administration}
        dropdown={entries.dropdown}
        messaging={entries.messaging}
      />
    );
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    expect(screen.getByText('Mon profil')).toBeInTheDocument();
    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
    expect(screen.queryByText('Tableau de bord')).not.toBeInTheDocument();
  });
});
