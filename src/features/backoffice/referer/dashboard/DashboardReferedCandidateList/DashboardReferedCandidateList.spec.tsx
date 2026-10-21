import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { DashboardReferedCandidateList } from './DashboardReferedCandidateList';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: () => ({ id: 'referer-1' }),
}));
jest.mock('../../../network-directory/NetworkDirectoryItem', () => ({
  NetworkDirectoryUserItem: ({ firstName, isAvailable }: any) => (
    <div data-testid="candidate">
      {firstName}:{String(isAvailable)}
    </div>
  ),
}));
jest.mock('@/src/components/ui/CardList', () => ({
  CardList: ({ list, isLoading }: any) => (
    <div data-testid="list" data-loading={String(isLoading)}>
      {list}
    </div>
  ),
}));

describe('DashboardReferedCandidateList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads the first twenty refered candidates, loading then listed', async () => {
    (Api.getReferedCandidateProfiles as jest.Mock).mockResolvedValue({
      data: [
        { id: 'p1', firstName: 'Awa' },
        { id: 'p2', firstName: 'Bilal', unavailableAt: '2026-01-01' },
      ],
    });
    render(<DashboardReferedCandidateList />);
    expect(screen.getByTestId('list')).toHaveAttribute('data-loading', 'true');
    await waitFor(() =>
      expect(screen.getAllByTestId('candidate')).toHaveLength(2)
    );
    expect(screen.getByTestId('list')).toHaveAttribute('data-loading', 'false');
    expect(Api.getReferedCandidateProfiles).toHaveBeenCalledWith({
      offset: 0,
      limit: 20,
    });
    expect(screen.getByText('Awa:true')).toBeInTheDocument();
    expect(screen.getByText('Bilal:false')).toBeInTheDocument();
  });

  it('stops loading when the request fails, and links to the follow-up page', async () => {
    (Api.getReferedCandidateProfiles as jest.Mock).mockRejectedValue(
      new Error('x')
    );
    render(<DashboardReferedCandidateList />);
    await waitFor(() =>
      expect(screen.getByTestId('list')).toHaveAttribute(
        'data-loading',
        'false'
      )
    );
    expect(screen.queryAllByTestId('candidate')).toHaveLength(0);
    expect(
      screen.getByRole('link', { name: 'Voir le suivi de mes candidats' })
    ).toHaveAttribute('href', '/backoffice/referer/candidates');
  });
});
