import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { DashboardNetworkDiscoveryCard } from './DashboardNetworkDiscoverCard';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

describe('DashboardNetworkDiscoveryCard', () => {
  beforeEach(() => {
    mockDesktop = true;
  });

  it('invites a candidate to discover coaches', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
    render(<DashboardNetworkDiscoveryCard />);

    expect(
      screen.getByText('Découvrez les coachs qui pourraient vous accompagner')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Découvrez les coachs').closest('a')
    ).toHaveAttribute('href', '/backoffice/annuaire?entity=user&role=Coach');
  });

  it('invites a coach to discover candidates', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
    render(<DashboardNetworkDiscoveryCard />);

    expect(
      screen.getByText('Découvrez les candidats').closest('a')
    ).toHaveAttribute('href', '/backoffice/annuaire?entity=user&role=Candidat');
  });

  it('shows the illustration on desktop only', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
    const { unmount } = render(<DashboardNetworkDiscoveryCard />);
    expect(
      screen.getByAltText("Illustration réseau d'entraide")
    ).toBeInTheDocument();
    unmount();

    mockDesktop = false;
    render(<DashboardNetworkDiscoveryCard />);
    expect(
      screen.queryByAltText("Illustration réseau d'entraide")
    ).not.toBeInTheDocument();
  });
});
