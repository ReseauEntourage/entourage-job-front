import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { HelpGroupPage } from '../HelpGroupPage';
import { buildDiscussionItem } from '../__fixtures__/help-groups.fixtures';

jest.mock('@/src/use-cases/help-groups', () => ({
  ...jest.requireActual('@/src/use-cases/help-groups'),
  useGetHelpGroupQuery: jest.fn(),
  useGetHelpGroupDiscussionsInfiniteQuery: jest.fn(),
}));
jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

// eslint-disable-next-line import-x/order
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionsInfiniteQuery,
  useGetHelpGroupQuery,
} from '@/src/use-cases/help-groups';

const group = {
  id: 'group-1',
  slug: 'refaire-un-cv',
  name: 'Refaire un CV',
  description: 'Description',
  charter: 'Bienveillance',
  membersCount: 3,
  isMember: false,
  isPublished: true,
};

const discussionsResult = (overrides = {}) => ({
  data: undefined,
  isLoading: false,
  isFetching: false,
  isFetchingNextPage: false,
  isError: false,
  hasNextPage: false,
  fetchNextPage: jest.fn(),
  refetch: jest.fn(),
  ...overrides,
});

describe('HelpGroupPage loading states', () => {
  it('shows an error with a retry, not an endless loading, when the group fails to load', () => {
    const refetch = jest.fn();
    (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: HelpGroupsError.FETCH_FAILED,
      refetch,
    });
    (useGetHelpGroupDiscussionsInfiniteQuery as jest.Mock).mockReturnValue(
      discussionsResult()
    );
    renderWithProviders(<HelpGroupPage slug="refaire-un-cv" />);
    expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument();
    expect(screen.getByTestId('help-group-load-error')).toHaveTextContent(
      'Ce groupe n’a pas pu être chargé.'
    );
    fireEvent.click(screen.getByTestId('help-group-load-error-retry'));
    expect(refetch).toHaveBeenCalled();
  });

  it('does not present failed discussions as a group that just opened', () => {
    const refetch = jest.fn();
    (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
      data: group,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    });
    (useGetHelpGroupDiscussionsInfiniteQuery as jest.Mock).mockReturnValue(
      discussionsResult({ isError: true, refetch })
    );
    renderWithProviders(<HelpGroupPage slug="refaire-un-cv" />);
    expect(document.body).not.toHaveTextContent("Ce groupe vient d'ouvrir");
    expect(screen.getByTestId('help-group-load-error')).toHaveTextContent(
      'Les discussions n’ont pas pu être chargées.'
    );
    fireEvent.click(screen.getByTestId('help-group-load-error-retry'));
    expect(refetch).toHaveBeenCalled();
  });

  it('keeps the loaded discussions and retries the next page when it fails', () => {
    const fetchNextPage = jest.fn();
    (useGetHelpGroupQuery as jest.Mock).mockReturnValue({
      data: group,
      isLoading: false,
      error: undefined,
      refetch: jest.fn(),
    });
    (useGetHelpGroupDiscussionsInfiniteQuery as jest.Mock).mockReturnValue(
      discussionsResult({
        data: { pages: [{ items: [buildDiscussionItem()], nextCursor: 'c' }] },
        isError: true,
        hasNextPage: true,
        fetchNextPage,
      })
    );
    renderWithProviders(<HelpGroupPage slug="refaire-un-cv" />);
    expect(screen.getAllByTestId('discussion-row')).toHaveLength(1);
    fireEvent.click(screen.getByTestId('help-group-load-error-retry'));
    expect(fetchNextPage).toHaveBeenCalled();
  });
});
