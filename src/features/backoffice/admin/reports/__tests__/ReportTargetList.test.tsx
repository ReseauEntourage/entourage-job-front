import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ReportTargetItem } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ReportTargetList } from '../ReportTargetList';

const mockUseTargets = jest.fn();
let mockQuery: Record<string, string> = {};

jest.mock('@/src/use-cases/reports', () => ({
  ...jest.requireActual('@/src/use-cases/reports'),
  useGetAdminReportTargetsInfiniteQuery: (params: unknown) =>
    mockUseTargets(params),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ id: 'admin-1', role: 'Admin', zone: 'LYON' }),
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockQuery,
    asPath: '/backoffice/admin/signalements',
    push: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
  }),
}));

const buildTarget = (
  props: Partial<ReportTargetItem> = {}
): ReportTargetItem => ({
  targetType: 'USER_PROFILE',
  targetId: 'user-1',
  label: 'Jeanne Martin',
  zones: ['LYON'],
  pendingCount: 3,
  reportsCount: 3,
  reasons: ['SPAM', 'FRAUD'],
  lastReportedAt: '2026-10-02T10:00:00.000Z',
  status: 'PENDING',
  ...props,
});

const pages = (items: ReportTargetItem[]) => ({
  data: { pages: [{ items, nextCursor: null }] },
  isLoading: false,
  isError: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: jest.fn(),
});

describe('ReportTargetList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = {};
    mockUseTargets.mockReturnValue(pages([buildTarget()]));
  });

  it('filters by default on the targets to handle of the zone of the admin', () => {
    renderWithProviders(<ReportTargetList />);
    expect(mockUseTargets).toHaveBeenCalledWith({
      status: 'PENDING',
      zone: 'LYON',
    });
    const filters = screen.getByTestId('report-filters');
    expect(filters).toHaveTextContent('À traiter');
    expect(filters).toHaveTextContent('Lyon');
    expect(filters).toHaveTextContent('Tous les types');
  });

  it('lists every zone and status once the filters are removed', () => {
    mockQuery = { zone: 'ALL', status: 'ALL', type: 'GROUP_MESSAGE' };
    renderWithProviders(<ReportTargetList />);
    expect(mockUseTargets).toHaveBeenCalledWith({ type: 'GROUP_MESSAGE' });
  });

  it('shows a target reported several times on a single row', () => {
    renderWithProviders(<ReportTargetList />);
    const list = screen.getByTestId('report-target-list');
    expect(list).toHaveTextContent('Jeanne Martin');
    expect(list).toHaveTextContent('Profil');
    expect(list).toHaveTextContent('Spam, Arnaque');
    expect(list).toHaveTextContent('À traiter');
    expect(list).toHaveTextContent('3');
    expect(screen.getByText('Jeanne Martin').closest('a')).toHaveAttribute(
      'href',
      '/backoffice/admin/signalements/USER_PROFILE/user-1'
    );
  });

  it('tells when no target matches the filters', () => {
    mockUseTargets.mockReturnValue(pages([]));
    renderWithProviders(<ReportTargetList />);
    expect(
      screen.getByText('Aucun signalement pour ces filtres')
    ).toBeInTheDocument();
  });
});
