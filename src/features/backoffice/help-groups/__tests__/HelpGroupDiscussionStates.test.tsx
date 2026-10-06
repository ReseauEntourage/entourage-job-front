import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupDiscussion } from '../HelpGroupDiscussion';
import { buildDiscussion } from '../__fixtures__/help-groups.fixtures';

const mockRefetchGroup = jest.fn();

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useGetHelpGroupQuery: jest.fn(),
  useGetHelpGroupDiscussionQuery: jest.fn(),
  useGetHelpGroupDiscussionRepliesInfiniteQuery: () => ({
    data: { pages: [{ items: [], nextCursor: null }] },
    isLoading: false,
    isFetching: false,
    isFetchingNextPage: false,
    isError: false,
    hasNextPage: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  }),
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUser: () => ({ id: 'viewer-1', firstName: 'Julien' }),
}));
jest.mock('../hooks/useDiscussionRealtime', () => ({
  useDiscussionRealtime: () => ({ isLive: true }),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

// eslint-disable-next-line import-x/order
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionQuery,
  useGetHelpGroupQuery,
} from '@/src/use-cases/help-groups';

const renderDiscussion = () =>
  renderWithProviders(
    <HelpGroupDiscussion
      slug="refaire-un-cv"
      discussionId="discussion-1"
      replyId={null}
    />
  );

describe('HelpGroupDiscussion states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useGetHelpGroupDiscussionQuery as jest.Mock).mockReturnValue({
      data: buildDiscussion(),
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    });
  });

  it('shows a retryable error instead of a silent read-only thread when the group fails', () => {
    (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: HelpGroupsError.FETCH_FAILED,
      refetch: mockRefetchGroup,
    });
    renderDiscussion();
    expect(
      screen.getByText('Ce groupe n’a pas pu être chargé.')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('discussion-panel')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
    expect(mockRefetchGroup).toHaveBeenCalled();
  });

  it('shows the not found page when the group is not found', () => {
    (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: HelpGroupsError.NOT_FOUND,
      refetch: mockRefetchGroup,
    });
    renderDiscussion();
    expect(screen.queryByTestId('discussion-panel')).not.toBeInTheDocument();
  });
});
