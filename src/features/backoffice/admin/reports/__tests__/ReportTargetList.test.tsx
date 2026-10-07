import '@testing-library/jest-dom';
import { fireEvent, screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ReportTargetItem } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ReportTargetList } from '../ReportTargetList';

const mockUseTargets = jest.fn();
const mockPush = jest.fn();
let mockIsDesktop = true;
let mockQuery: Record<string, string> = {};

jest.mock('@/src/use-cases/reports', () => ({
  ...jest.requireActual('@/src/use-cases/reports'),
  useGetAdminReportTargetsInfiniteQuery: (params: unknown) =>
    mockUseTargets(params),
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ id: 'admin-1', role: 'Admin', zone: 'LYON' }),
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: () => mockIsDesktop,
  useIsMobile: () => !mockIsDesktop,
}));
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: mockQuery,
    asPath: '/backoffice/admin/signalements',
    push: mockPush,
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
    mockIsDesktop = true;
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
    const types = screen.getByRole('radiogroup', { name: 'Type' });
    expect(within(types).getByRole('radio', { name: 'Tous' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('filters by type with the pills, kept in the URL with the other filters', () => {
    renderWithProviders(<ReportTargetList />);
    const types = screen.getByRole('radiogroup', { name: 'Type' });
    expect(within(types).getAllByRole('radio')).toHaveLength(4);

    fireEvent.click(
      within(types).getByRole('radio', { name: 'Messages de groupe' })
    );
    expect(mockPush).toHaveBeenLastCalledWith(
      {
        pathname: '/backoffice/admin/signalements',
        query: { type: 'GROUP_MESSAGE', status: 'PENDING', zone: 'LYON' },
      },
      undefined,
      { shallow: true, scroll: false }
    );

    // Arrow keys move the choice, as in a radio group
    fireEvent.keyDown(types, { key: 'ArrowRight' });
    expect(mockPush).toHaveBeenLastCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ type: 'CONVERSATION' }),
      }),
      undefined,
      { shallow: true, scroll: false }
    );
  });

  it('checks the type pill read from the URL', () => {
    mockQuery = { type: 'USER_PROFILE' };
    renderWithProviders(<ReportTargetList />);
    expect(screen.getByRole('radio', { name: 'Profils' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByRole('radio', { name: 'Tous' })).toHaveAttribute(
      'aria-checked',
      'false'
    );
  });

  it('lists every zone and status once the filters are removed', () => {
    mockQuery = { zone: 'ALL', status: 'ALL', type: 'GROUP_MESSAGE' };
    renderWithProviders(<ReportTargetList />);
    expect(mockUseTargets).toHaveBeenCalledWith({ type: 'GROUP_MESSAGE' });
  });

  [true, false].forEach((isDesktop) => {
    it(`shows a target reported several times on a single card (${
      isDesktop ? 'desktop' : 'mobile'
    })`, () => {
      mockIsDesktop = isDesktop;
      renderWithProviders(<ReportTargetList />);
      const list = screen.getByTestId('report-target-list');
      expect(list).toHaveTextContent('Jeanne Martin');
      expect(list).toHaveTextContent('Profil');
      expect(list).toHaveTextContent('Lyon');
      expect(within(list).getByText('Spam')).toBeInTheDocument();
      expect(within(list).getByText('Arnaque')).toBeInTheDocument();
      expect(list).toHaveTextContent('3 · À traiter');
      expect(list).toHaveTextContent(/dernier signalement/i);
      expect(screen.getByText('Jeanne Martin').closest('a')).toHaveAttribute(
        'href',
        '/backoffice/admin/signalements/USER_PROFILE/user-1'
      );
    });
  });

  it('shows « Traité » for a handled target', () => {
    mockUseTargets.mockReturnValue(
      pages([buildTarget({ status: 'RESOLVED', pendingCount: 0 })])
    );
    renderWithProviders(<ReportTargetList />);
    const list = screen.getByTestId('report-target-list');
    expect(list).toHaveTextContent('Traité');
    expect(list).not.toHaveTextContent('À traiter');
  });

  it('loads the next page with « Voir plus »', () => {
    const fetchNextPage = jest.fn();
    mockUseTargets.mockReturnValue({
      ...pages([buildTarget()]),
      hasNextPage: true,
      fetchNextPage,
    });
    renderWithProviders(<ReportTargetList />);
    fireEvent.click(screen.getByTestId('report-target-list-more'));
    expect(fetchNextPage).toHaveBeenCalled();
  });

  it('tells when no target matches the filters', () => {
    mockUseTargets.mockReturnValue(pages([]));
    renderWithProviders(<ReportTargetList />);
    expect(
      screen.getByText('Aucun signalement pour ces filtres')
    ).toBeInTheDocument();
  });
});
