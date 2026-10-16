import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { NavConnectedContentDesktop } from '../NavConnectedContent.desktop';
import { renderLinks } from '../NavConnectedContent.utils';

const admin = {
  id: 'admin-1',
  firstName: 'Paul',
  lastName: 'Admin',
  role: UserRoles.ADMIN,
  zone: 'LYON',
  onboardingCompletedAt: new Date().toISOString(),
} as unknown as User;

jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => admin,
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => null,
}));
jest.mock('@/src/features/notifications-center', () => ({
  NotificationsBell: () => null,
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

const renderNav = (reports: number) => {
  const { links, administration, dropdown, messaging } = renderLinks(
    admin,
    jest.fn(),
    null,
    true
  );
  return renderWithProviders(
    <NavConnectedContentDesktop
      links={links}
      administration={administration}
      dropdown={dropdown}
      messaging={messaging}
      badges={{ messaging: 0, notifications: 0, reports }}
    />
  );
};

describe('NavConnectedContentDesktop - reports badge', () => {
  it('shows the number of targets to handle on the cog', () => {
    renderNav(2);
    expect(screen.getByTestId('nav-administration-badge')).toHaveTextContent(
      '2'
    );
  });

  it('shows no badge when nothing is to handle', () => {
    renderNav(0);
    expect(
      screen.queryByTestId('nav-administration-badge')
    ).not.toBeInTheDocument();
  });
});
