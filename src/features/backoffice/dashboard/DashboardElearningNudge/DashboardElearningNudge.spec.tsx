import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useElearning } from '@/src/features/backoffice/elearning/useElearning';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { DashboardElearningNudge } from './DashboardElearningNudge';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));
jest.mock('@/src/features/backoffice/elearning/useElearning', () => ({
  useElearning: jest.fn(),
}));

const mockUser = useAuthenticatedUser as jest.Mock;
const mockCompany = useCurrentUserCompany as jest.Mock;
const mockElearning = useElearning as jest.Mock;

describe('DashboardElearningNudge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCompany.mockReturnValue(undefined);
    mockElearning.mockReturnValue({
      completionRate: 0,
      nbUnitsCompleted: 0,
      nbUnitsTotal: 4,
    });
  });

  [UserRoles.ADMIN, UserRoles.REFERER].forEach((role) => {
    it(`renders nothing for the ${role} role`, () => {
      mockUser.mockReturnValue({ role });
      const { container } = render(<DashboardElearningNudge />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  it('renders nothing once the training is completed', () => {
    mockUser.mockReturnValue({
      role: UserRoles.COACH,
      elearningCompletedAt: '2026-01-01',
    });
    const { container } = render(<DashboardElearningNudge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for a company admin', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    mockCompany.mockReturnValue({ companyUser: { isAdmin: true } });
    const { container } = render(<DashboardElearningNudge />);
    expect(container).toBeEmptyDOMElement();
  });

  it('invites a candidate to start the training, without progress', () => {
    mockUser.mockReturnValue({ role: UserRoles.CANDIDATE });
    render(<DashboardElearningNudge />);
    expect(
      screen.getByText(
        'Finalisez la formation pour contacter et être contacté par des coachs'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Comprendre comment les coachs peuvent vous soutenir')
    ).toBeInTheDocument();
    expect(screen.queryByText(/restant/)).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Commencer ma formation' })
    ).toHaveAttribute('href', '/backoffice/ressources/formations');
  });

  it('shows coach benefits and the remaining modules (plural) when in progress', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    mockElearning.mockReturnValue({
      completionRate: 25,
      nbUnitsCompleted: 1,
      nbUnitsTotal: 4,
    });
    render(<DashboardElearningNudge />);
    expect(
      screen.getByText(
        'Finalisez la formation pour contacter et être contacté par des candidats'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('Avoir la bonne posture vis-à-vis des candidats')
    ).toBeInTheDocument();
    expect(screen.getByText('3 modules restants')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Continuer ma formation' })
    ).toBeInTheDocument();
  });

  it('uses the singular for one remaining module', () => {
    mockUser.mockReturnValue({ role: UserRoles.COACH });
    mockElearning.mockReturnValue({
      completionRate: 75,
      nbUnitsCompleted: 3,
      nbUnitsTotal: 4,
    });
    render(<DashboardElearningNudge />);
    expect(screen.getByText('1 module restant')).toBeInTheDocument();
  });
});
