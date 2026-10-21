import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import {
  Conversation,
  ConversationType,
  Message,
  MessageType,
} from '@/src/api/types';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { MessagingConversationListItem } from './MessagingConversationListItem';

let mockWidth = 1280;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => mockWidth,
  useWindowSize: () => [mockWidth, 800],
}));
jest.mock('@/src/api');
jest.mock('@/src/use-cases/current-user', () => ({
  ...jest.requireActual('@/src/use-cases/current-user'),
  selectCurrentUserId: () => 'me',
}));

const buildMessage = (overrides: Partial<Message> = {}): Message =>
  ({
    id: 'm1',
    content: 'Bonjour à toi',
    authorId: 'other',
    createdAt: '2026-10-01T10:00:00.000Z',
    type: MessageType.USER,
    ...overrides,
  }) as Message;

const buildConversation = (
  overrides: Partial<Conversation> = {}
): Conversation =>
  ({
    id: 'conv-1',
    type: ConversationType.DIRECT,
    messages: [buildMessage()],
    seenAt: '2026-10-05T10:00:00.000Z',
    archivedAt: null,
    participants: [
      { id: 'me', firstName: 'Moi', lastName: 'Meme', userProfile: {} },
      {
        id: 'other',
        firstName: 'Awa',
        lastName: 'Diallo',
        role: 'Coach',
        userProfile: { hasPicture: false },
      },
    ],
    ...overrides,
  }) as unknown as Conversation;

describe('MessagingConversationListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWidth = 1280;
  });

  it('shows the addressee, their role, the date and the last message preview', () => {
    renderWithProviders(
      <MessagingConversationListItem conversation={buildConversation()} />
    );
    expect(screen.getByText('Awa Diallo')).toBeInTheDocument();
    expect(screen.getByText('Coach')).toBeInTheDocument();
    expect(screen.getByText('01/10/2026')).toBeInTheDocument();
    expect(screen.getByText('Bonjour à toi')).toBeInTheDocument();
  });

  it('previews the last user message rather than a service one', () => {
    renderWithProviders(
      <MessagingConversationListItem
        conversation={buildConversation({
          messages: [
            buildMessage({ content: 'service', type: MessageType.SERVICE }),
            buildMessage({ content: 'vrai message' }),
          ],
        })}
      />
    );
    expect(screen.getByText('vrai message')).toBeInTheDocument();
    expect(screen.queryByText('service')).toBeNull();
  });

  it('describes a message made of files only, with the plural', () => {
    renderWithProviders(
      <MessagingConversationListItem
        conversation={buildConversation({
          messages: [
            buildMessage({
              content: '',
              medias: [{}, {}] as any,
              author: { firstName: 'Awa' } as any,
            }),
          ],
        })}
      />
    );
    expect(screen.getByText(/Awa a envoyé 2\s+fichiers/)).toBeInTheDocument();
  });

  it('uses the singular for a single file', () => {
    renderWithProviders(
      <MessagingConversationListItem
        conversation={buildConversation({
          messages: [
            buildMessage({
              content: '',
              medias: [{}] as any,
              author: { firstName: 'Awa' } as any,
            }),
          ],
        })}
      />
    );
    expect(screen.getByText(/Awa a envoyé 1\s+fichier$/)).toBeInTheDocument();
  });

  it('selects the conversation on click', () => {
    const { store } = renderWithProviders(
      <MessagingConversationListItem conversation={buildConversation()} />
    );
    fireEvent.click(screen.getByTestId('messaging-conversation-item'));
    expect(store.getState().messaging.selectedConversationId).toBe('conv-1');
  });

  it('archives the conversation without selecting it', async () => {
    (Api.archiveConversation as jest.Mock).mockResolvedValue({});
    const { store } = renderWithProviders(
      <MessagingConversationListItem conversation={buildConversation()} />
    );
    fireEvent.click(screen.getByTestId('messaging-archive-button'));
    await waitFor(() =>
      expect(Api.archiveConversation).toHaveBeenCalledWith('conv-1')
    );
    expect(store.getState().messaging.selectedConversationId).toBeNull();
  });

  it('unarchives an archived conversation', async () => {
    (Api.unarchiveConversation as jest.Mock).mockResolvedValue({});
    renderWithProviders(
      <MessagingConversationListItem
        conversation={buildConversation({
          archivedAt: '2026-09-01T10:00:00.000Z',
        })}
      />
    );
    fireEvent.click(screen.getByTestId('messaging-unarchive-button'));
    await waitFor(() =>
      expect(Api.unarchiveConversation).toHaveBeenCalledWith('conv-1')
    );
    expect(screen.queryByTestId('messaging-archive-button')).toBeNull();
  });

  it('hides the archive button on mobile', () => {
    mockWidth = 400;
    renderWithProviders(
      <MessagingConversationListItem conversation={buildConversation()} />
    );
    expect(screen.queryByTestId('messaging-archive-button')).toBeNull();
  });
});
