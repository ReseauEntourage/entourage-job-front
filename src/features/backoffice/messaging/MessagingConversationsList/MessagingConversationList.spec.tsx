import '@testing-library/jest-dom';
import { fireEvent, screen, within } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Conversation, MessageType } from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { MessagingConversationList } from './MessagingConversationList';

let mockWidth = 1280;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => mockWidth,
  useWindowSize: () => [mockWidth, 800],
}));
let mockConversations: Conversation[] | undefined;
jest.mock('@/src/use-cases/messaging', () => ({
  ...jest.requireActual('@/src/use-cases/messaging'),
  selectConversations: () => mockConversations,
  useGetConversationsQuery: jest.fn(),
  useGetUnseenConversationsCountQuery: jest.fn(),
}));
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUserId: () => 'me',
}));
jest.mock(
  './MessagingConversationListItem/MessagingConversationListItem',
  () => ({
    MessagingConversationListItem: ({ conversation }: any) => (
      <div data-testid="item">{conversation.id}</div>
    ),
  })
);
jest.mock('@/src/features/filters/SearchBar/SearchBar', () => ({
  SearchBar: ({ setSearch }: any) => (
    <input aria-label="search" onChange={(e) => setSearch(e.target.value)} />
  ),
}));

const build = (
  id: string,
  firstName: string,
  { unread = false, archived = false } = {}
): Conversation =>
  ({
    id,
    archivedAt: archived ? '2026-09-01T10:00:00.000Z' : null,
    seenAt: unread ? undefined : '2026-12-01T10:00:00.000Z',
    messages: [
      {
        id: `m-${id}`,
        authorId: 'other',
        type: MessageType.USER,
        content: 'x',
        createdAt: '2026-10-01T10:00:00.000Z',
      },
    ],
    participants: [
      { id: 'me', firstName: 'Moi', lastName: 'Meme', userProfile: {} },
      { id: `o-${id}`, firstName, lastName: 'Nom', userProfile: {} },
    ],
  }) as unknown as Conversation;

const ids = () => screen.queryAllByTestId('item').map((el) => el.textContent);

describe('MessagingConversationList', () => {
  beforeEach(() => {
    mockWidth = 1280;
    mockConversations = [
      build('read', 'Alice'),
      build('unread', 'Bob', { unread: true }),
      build('archived', 'Carl', { archived: true }),
      build('archivedUnread', 'Dora', { archived: true, unread: true }),
    ];
  });

  it('shows no count until conversations are loaded', () => {
    mockConversations = undefined;
    renderWithProviders(<MessagingConversationList />);
    expect(screen.getByTestId('messaging-tab-all')).toHaveTextContent(
      /^En cours$/
    );
    expect(ids()).toEqual([]);
  });

  it('lists the active conversations, unread first, archived ones excluded', () => {
    renderWithProviders(<MessagingConversationList />);
    expect(ids()).toEqual(['unread', 'read']);
    expect(screen.getByTestId('messaging-tab-all')).toHaveTextContent(
      'En cours · 2'
    );
    expect(screen.getByTestId('messaging-tab-unread')).toHaveTextContent(
      'Non lues · 2'
    );
    expect(screen.getByTestId('messaging-tab-archived')).toHaveTextContent(
      'Archivées · 2'
    );
  });

  it('the unread tab also surfaces archived conversations with news', () => {
    renderWithProviders(<MessagingConversationList />);
    fireEvent.click(screen.getByTestId('messaging-tab-unread'));
    expect(ids()).toEqual(['unread', 'archivedUnread']);
  });

  it('the archived tab lists archived conversations', () => {
    renderWithProviders(<MessagingConversationList />);
    fireEvent.click(screen.getByTestId('messaging-tab-archived'));
    expect(ids()).toEqual(['archived', 'archivedUnread']);
  });

  it('shows an empty state for the unread and archived tabs', () => {
    mockConversations = [build('read', 'Alice')];
    renderWithProviders(<MessagingConversationList />);
    fireEvent.click(screen.getByTestId('messaging-tab-unread'));
    expect(
      screen.getByTestId('messaging-unread-empty-state')
    ).toHaveTextContent('Aucune conversation non lue');
    fireEvent.click(screen.getByTestId('messaging-tab-archived'));
    expect(
      screen.getByTestId('messaging-archived-empty-state')
    ).toHaveTextContent('Aucune conversation archivée');
  });

  it('filters on the addressee name and updates the counts accordingly', () => {
    renderWithProviders(<MessagingConversationList />);
    fireEvent.change(screen.getByLabelText('search'), {
      target: { value: 'bo' },
    });
    expect(ids()).toEqual(['unread']);
    expect(screen.getByTestId('messaging-tab-all')).toHaveTextContent(
      'En cours · 1'
    );
    expect(screen.getByTestId('messaging-tab-archived')).toHaveTextContent(
      'Archivées · 0'
    );
  });

  it('never matches on the current user name', () => {
    renderWithProviders(<MessagingConversationList />);
    fireEvent.change(screen.getByLabelText('search'), {
      target: { value: 'moi' },
    });
    expect(ids()).toEqual([]);
  });

  it('hides the search bar on mobile', () => {
    mockWidth = 400;
    renderWithProviders(<MessagingConversationList />);
    expect(screen.queryByTestId('messaging-search-bar')).toBeNull();
    expect(
      within(
        screen.getByTestId('messaging-conversation-list')
      ).queryByLabelText('search')
    ).toBeNull();
  });
});
