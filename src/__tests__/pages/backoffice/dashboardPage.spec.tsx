import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { User } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import DashboardPage from '@/src/pages/backoffice/dashboard';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';

jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock('@/src/features/backoffice/dashboard', () => ({
  Dashboard: () => <div data-testid="Dashboard" />,
  AdminDashboard: () => <div data-testid="AdminDashboard" />,
}));

const renderAs = (role?: UserRoles) => {
  const store = createTestStore();
  if (role) {
    store.dispatch(
      currentUserActions.fetchUserSucceeded({ id: 'u', role } as User)
    );
  }
  return renderWithProviders(<DashboardPage />, { store });
};

describe('dashboard page', () => {
  it('renders the admin dashboard for an admin, inside the back office layout', () => {
    renderAs(UserRoles.ADMIN);

    expect(screen.getByTestId('layout').getAttribute('data-title')).toBe(
      'Mon tableau de bord'
    );
    expect(screen.getByTestId('AdminDashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('Dashboard')).not.toBeInTheDocument();
  });

  [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER].forEach((role) => {
    it(`renders the regular dashboard for a ${role}`, () => {
      renderAs(role);

      expect(screen.getByTestId('Dashboard')).toBeInTheDocument();
      expect(screen.queryByTestId('AdminDashboard')).not.toBeInTheDocument();
    });
  });

  it('renders the regular dashboard while the user is not loaded yet', () => {
    renderAs();

    expect(screen.getByTestId('Dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('AdminDashboard')).not.toBeInTheDocument();
  });
});
