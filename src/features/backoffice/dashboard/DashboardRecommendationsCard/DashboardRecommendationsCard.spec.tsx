import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useEmbeddingStatus } from '@/src/hooks/useEmbeddingStatus';
import { DashboardRecommendationsCard } from './DashboardRecommendationsCard';
import { useDashboardRecommendations } from './useDashboardRecommendations';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('@/src/hooks/useEmbeddingStatus', () => ({
  useEmbeddingStatus: jest.fn(),
}));
jest.mock('./useDashboardRecommendations', () => ({
  useDashboardRecommendations: jest.fn(),
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));
jest.mock('../DashboardNetworkDiscoverCard', () => ({
  DashboardNetworkDiscoveryCard: () => <div>network-discovery</div>,
}));
jest.mock('../../network-directory/NetworkDirectoryItem', () => ({
  NetworkDirectoryUserItem: ({ firstName, recommendationReason }: any) => (
    <div data-testid="reco">
      {firstName}|{String(recommendationReason)}
    </div>
  ),
}));
jest.mock('@/src/components/ui/CardList', () => ({
  CardList: ({ list }: { list: React.ReactNode[] }) => <div>{list}</div>,
}));

const mockHook = (overrides = {}) =>
  (useDashboardRecommendations as jest.Mock).mockReturnValue({
    recommendations: [],
    isLoading: false,
    isError: false,
    isEmbeddingPending: false,
    ...overrides,
  });

const profile = (id: string, extra = {}) => ({
  id,
  firstName: `Name${id}`,
  lastName: 'L',
  role: UserRoles.COACH,
  ...extra,
});

describe('DashboardRecommendationsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDesktop = true;
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.CANDIDATE,
    });
    (useCurrentUserCompany as jest.Mock).mockReturnValue(undefined);
    (useCurrentUserProfile as jest.Mock).mockReturnValue({
      department: 'Paris (75)',
    });
    mockHook();
  });

  it('falls back to the network discovery card without recommendation', () => {
    render(<DashboardRecommendationsCard />);
    expect(screen.getByText('network-discovery')).toBeInTheDocument();
  });

  it('falls back to the network discovery card on error', () => {
    mockHook({
      recommendations: [{ publicProfile: profile('1') }],
      isError: true,
    });
    render(<DashboardRecommendationsCard />);
    expect(screen.getByText('network-discovery')).toBeInTheDocument();
  });

  it('shows a skeleton and an explanation while the embedding is computed', () => {
    mockHook({ isEmbeddingPending: true });
    render(<DashboardRecommendationsCard />);
    expect(
      screen.getByText(/Nous analysons actuellement les profils/)
    ).toBeInTheDocument();
    expect(useEmbeddingStatus).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true })
    );
  });

  it('recommends coaches to a candidate, linking to the directory of their department', () => {
    mockHook({
      recommendations: [{ publicProfile: profile('1'), reason: null }],
    });
    render(<DashboardRecommendationsCard />);
    expect(
      screen.getByText('Les coachs recommandés pour vous')
    ).toBeInTheDocument();
    expect(screen.getByTestId('reco')).toHaveTextContent('Name1|null');
    const link = screen.getByRole('link', { name: 'Voir tous les coachs' });
    expect(link.getAttribute('href')).toBe(
      '/backoffice/annuaire?departments=Paris+%2875%29'
    );
  });

  it('recommends candidates to a coach', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
    mockHook({ recommendations: [{ publicProfile: profile('1') }] });
    render(<DashboardRecommendationsCard />);
    expect(
      screen.getByText('Les candidats recommandés pour vous')
    ).toBeInTheDocument();
  });

  it('uses the company wording for a company admin, even when coach', () => {
    (useAuthenticatedUser as jest.Mock).mockReturnValue({
      role: UserRoles.COACH,
    });
    (useCurrentUserCompany as jest.Mock).mockReturnValue({
      companyUser: { isAdmin: true },
    });
    mockHook({ recommendations: [{ publicProfile: profile('1') }] });
    render(<DashboardRecommendationsCard />);
    expect(
      screen.getByText('Les candidats recommandés pour votre entreprise')
    ).toBeInTheDocument();
  });

  it('accepts the legacy flat recommendation shape and forwards the reason', () => {
    mockHook({
      recommendations: [{ ...profile('legacy'), reason: 'Même secteur' }],
    });
    render(<DashboardRecommendationsCard />);
    expect(screen.getByTestId('reco')).toHaveTextContent(
      'Namelegacy|Même secteur'
    );
  });

  it('explains how the AI recommendations work on desktop only', () => {
    mockHook({
      recommendations: [
        { publicProfile: profile('1'), reason: 'Même secteur' },
      ],
    });
    const { unmount } = render(<DashboardRecommendationsCard />);
    expect(screen.getByText(/Comment ça marche/)).toBeInTheDocument();
    unmount();
    mockDesktop = false;
    render(<DashboardRecommendationsCard />);
    expect(screen.queryByText(/Comment ça marche/)).toBeNull();
  });

  it('does not explain anything when no recommendation carries a reason', () => {
    mockHook({
      recommendations: [{ publicProfile: profile('1'), reason: null }],
    });
    render(<DashboardRecommendationsCard />);
    expect(screen.queryByText(/Comment ça marche/)).toBeNull();
  });
});
