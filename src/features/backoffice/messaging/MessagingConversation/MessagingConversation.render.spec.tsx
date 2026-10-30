jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));
jest.mock('./MessagingConversationHeader/MessagingConversationHeader', () => ({
  MessagingConversationHeader: () => <div data-testid="header" />,
}));
jest.mock('./MessagingEditor/MessagingEditor', () => ({
  MessagingEditor: ({ readonly }: any) => (
    <div data-testid="editor">{String(!!readonly)}</div>
  ),
}));
jest.mock('./MessagingEthicsCharter/MessagingEthicsCharter', () => ({
  MessagingEthicsCharter: () => <div data-testid="ethics" />,
}));
jest.mock('./MessagingFirstContact/MessagingFirstContactBanner', () => ({
  MessagingFirstContactBanner: ({ role }: any) => (
    <div data-testid="first-contact">{role}</div>
  ),
}));
jest.mock('./MessagingCheckinBanner/MessagingCheckinBanner', () => ({
  MessagingCheckinBanner: ({ conversationId, otherFirstName }: any) => (
    <div data-testid="checkin">
      {conversationId}:{otherFirstName}
    </div>
  ),
}));
jest.mock('./MessagingMessage/MessagingMessage', () => ({
  MessagingMessage: ({ message }: any) => (
    <div data-testid="message">{message.id}</div>
  ),
}));
jest.mock('./MessagingPinnedInfo/MessagingPinnedInfo', () => ({
  MessagingPinnedInfo: ({ pinnedInfo }: any) => (
    <div data-testid="pinned">{pinnedInfo}</div>
  ),
}));
jest.mock('./MessagingSuggestions/MessagingSuggestions', () => ({
  MessagingSuggestions: ({
    onSuggestionClick,
    onOpenAIAssistant,
    variant,
    participants,
  }: any) => (
    <button
      data-testid={`suggestions-${variant ?? 'default'}`}
      onClick={() => onSuggestionClick({ message: 'Bonjour suggéré' })}
    >
      {participants.length}
      {onOpenAIAssistant && (
        <span
          data-testid={`suggestions-${variant ?? 'default'}-ai`}
          onClick={(e: any) => {
            e.stopPropagation();
            onOpenAIAssistant();
          }}
        >
          ai
        </span>
      )}
    </button>
  ),
}));
jest.mock('./MessagingWaitingReplyBanner/MessagingWaitingReplyBanner', () => ({
  MessagingWaitingReplyBanner: ({ recipientFirstName }: any) => (
    <div data-testid="waiting">{recipientFirstName}</div>
  ),
}));
jest.mock('./MessagingAIAssistantBanner/MessagingAIAssistantBanner', () => ({
  MessagingAIAssistantBanner: ({
    onOpenAssistant,
    onDismiss,
    compact,
  }: any) => (
    <div data-testid="ai-banner">
      <button data-testid="ai-banner-open" onClick={onOpenAssistant}>
        open
      </button>
      <button data-testid="ai-banner-dismiss" onClick={onDismiss}>
        dismiss
      </button>
      {compact ? 'compact' : 'full'}
    </div>
  ),
}));
jest.mock('../MessagingAIPanel', () => ({
  MessagingAIPanel: () => <div data-testid="ai-panel" />,
}));

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ConversationType, MessageType } from '@/src/api/types';
import { DELAY_REFRESH_CONVERSATIONS } from '@/src/constants';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { messagingActions } from '@/src/use-cases/messaging';
import {
  encodeMessageCursor,
  MESSAGES_PAGE_SIZE,
} from '@/src/use-cases/messaging/messaging.utils';
import { MessagingConversation } from './MessagingConversation';

const mockedApi = getMockedApi();
const mockUseIsMobile = useIsMobile as jest.Mock;

const participant = (id: string, role: string, extra: any = {}) => ({
  id,
  firstName: `First-${id}`,
  lastName: `Last-${id}`,
  role,
  gender: 0,
  userProfile: { hasPicture: false, unavailableAt: null },
  ...extra,
});

const message = (id: string, authorId: string | null, minute: number) => ({
  id,
  content: `content ${id}`,
  authorId,
  type: MessageType.USER,
  createdAt: new Date(Date.UTC(2026, 0, 1, 10, minute)).toISOString(),
  updatedAt: new Date(Date.UTC(2026, 0, 1, 10, minute)).toISOString(),
  conversationId: 'conv1',
  medias: [],
});

// Messages are newest-first, like the API returns them.
const buildConversation = (overrides: any = {}) => ({
  id: 'conv1',
  type: ConversationType.DIRECT,
  participants: [
    participant('me', UserRoles.COACH),
    participant('other', UserRoles.CANDIDATE),
  ],
  messages: [message('m2', 'other', 2), message('m1', 'other', 1)],
  ...overrides,
});

const settle = () =>
  act(async () => {
    await jest.advanceTimersByTimeAsync(10);
    await jest.advanceTimersByTimeAsync(10);
  });

async function setup({
  role = UserRoles.COACH,
  conversation,
  selected = 'conv1',
  prepare,
}: {
  role?: string;
  conversation?: any;
  selected?: string | null;
  prepare?: (store: ReturnType<typeof createTestStore>) => void;
} = {}) {
  const store = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({ id: 'me', role } as any)
  );
  if (conversation) {
    mockedApi.getConversationById.mockResolvedValue({
      data: conversation,
    } as any);
  }
  store.dispatch(messagingActions.selectConversation(selected));
  prepare?.(store);
  const utils = renderWithProviders(<MessagingConversation />, { store });
  await settle();
  return { ...utils, store };
}

describe('MessagingConversation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockUseIsMobile.mockReturnValue(false);
    // jsdom does not implement Element.scrollTo
    HTMLElement.prototype.scrollTo = jest.fn();
    mockedApi.getConversations.mockResolvedValue({ data: [] } as any);
    mockedApi.getCheckin.mockResolvedValue({
      data: { eligible: false, checkin: null, otherParticipant: null },
    } as any);
    mockedApi.markConversationSeen.mockResolvedValue({} as any);
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it('asks the user to pick a conversation when none is selected', async () => {
    await setup({ selected: null });
    expect(
      screen.getByText('Cliquer sur une conversation pour la lire')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('editor')).toBeNull();
  });

  it('loads the selected conversation, marks it as seen and shows messages oldest first', async () => {
    await setup({ conversation: buildConversation() });
    expect(mockedApi.getConversationById).toHaveBeenCalledWith('conv1');
    expect(mockedApi.markConversationSeen).toHaveBeenCalledWith('conv1');
    expect(screen.getAllByTestId('message').map((m) => m.textContent)).toEqual([
      'm1',
      'm2',
    ]);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('editor')).toHaveTextContent('false');
  });

  it('does not fetch a conversation for the new-conversation sentinel', async () => {
    await setup({
      selected: 'new',
      prepare: (store) =>
        store.dispatch(
          messagingActions.setNewConversationDraft([
            participant('other', UserRoles.CANDIDATE),
          ] as any)
        ),
    });
    expect(mockedApi.getConversationById).not.toHaveBeenCalled();
    expect(mockedApi.markConversationSeen).not.toHaveBeenCalled();
    expect(mockedApi.getCheckin).not.toHaveBeenCalled();
  });

  describe('first message of a new conversation', () => {
    const prepare = (store: ReturnType<typeof createTestStore>) =>
      store.dispatch(
        messagingActions.setNewConversationDraft([
          participant('other', UserRoles.CANDIDATE),
        ] as any)
      );

    it('shows suggestions, the first contact banner and the ethics charter for a coach', async () => {
      const { store } = await setup({ selected: 'new', prepare });
      expect(screen.getByTestId('suggestions-default')).toBeInTheDocument();
      expect(screen.getByTestId('first-contact')).toHaveTextContent(
        UserRoles.COACH
      );
      expect(screen.getByTestId('ethics')).toBeInTheDocument();
      expect(screen.queryByTestId('suggestions-quick-replies')).toBeNull();
      expect(screen.queryByTestId('ai-panel')).toBeNull();

      fireEvent.click(screen.getByTestId('suggestions-default'));
      expect(store.getState().messaging.newMessage).toBe('Bonjour suggéré');
    });

    it('shows no suggestions nor first contact banner for an admin', async () => {
      await setup({ role: UserRoles.ADMIN, selected: 'new', prepare });
      expect(screen.queryByTestId('suggestions-default')).toBeNull();
      expect(screen.queryByTestId('first-contact')).toBeNull();
      expect(screen.queryByTestId('ethics')).toBeNull();
    });

    it('resets the draft message when the selected conversation changes', async () => {
      const { store } = await setup({ selected: 'new', prepare });
      act(() => {
        store.dispatch(messagingActions.setNewMessage('draft'));
      });
      expect(store.getState().messaging.newMessage).toBe('draft');
      act(() => {
        store.dispatch(messagingActions.selectConversation('conv1'));
      });
      await settle();
      expect(store.getState().messaging.newMessage).toBe('');
    });
  });

  describe('existing conversation banners', () => {
    it('offers quick replies to a coach who has not written to a candidate yet', async () => {
      await setup({ conversation: buildConversation() });
      expect(screen.getByTestId('suggestions-quick-replies')).toHaveTextContent(
        '1'
      );
      expect(screen.getByTestId('first-contact')).toBeInTheDocument();
      expect(screen.getByTestId('ethics')).toBeInTheDocument();
      expect(screen.queryByTestId('waiting')).toBeNull();
    });

    it('hides first contact helpers once the current user has written', async () => {
      await setup({
        conversation: buildConversation({
          messages: [message('m2', 'other', 2), message('m1', 'me', 1)],
        }),
      });
      expect(screen.queryByTestId('suggestions-quick-replies')).toBeNull();
      expect(screen.queryByTestId('first-contact')).toBeNull();
      expect(screen.queryByTestId('ethics')).toBeNull();
    });

    it('hides quick replies when the other participant has an unexpected role', async () => {
      await setup({
        conversation: buildConversation({
          participants: [
            participant('me', UserRoles.COACH),
            participant('other', UserRoles.COACH),
          ],
        }),
      });
      expect(screen.queryByTestId('suggestions-quick-replies')).toBeNull();
    });

    it('shows the waiting reply banner when only the current user wrote', async () => {
      await setup({
        conversation: buildConversation({
          messages: [message('m1', 'me', 1)],
        }),
      });
      expect(screen.getByTestId('waiting')).toHaveTextContent('First-other');
    });

    it('does not show the waiting reply banner in group conversations', async () => {
      await setup({
        conversation: buildConversation({
          type: ConversationType.GROUP,
          messages: [message('m1', 'me', 1)],
        }),
      });
      expect(screen.queryByTestId('waiting')).toBeNull();
    });

    it('hides the first contact banner and ethics charter when an admin is in the conversation', async () => {
      await setup({
        conversation: buildConversation({
          participants: [
            participant('me', UserRoles.COACH),
            participant('adm', UserRoles.ADMIN),
          ],
        }),
      });
      expect(screen.queryByTestId('first-contact')).toBeNull();
      expect(screen.queryByTestId('ethics')).toBeNull();
    });

    it('shows the checkin banner when the checkin is eligible and not completed', async () => {
      mockedApi.getCheckin.mockResolvedValue({
        data: { eligible: true, checkin: null, otherParticipant: null },
      } as any);
      await setup({ conversation: buildConversation() });
      expect(screen.getByTestId('checkin')).toHaveTextContent(
        'conv1:First-other'
      );
    });

    it('hides the checkin banner once the checkin is completed', async () => {
      mockedApi.getCheckin.mockResolvedValue({
        data: {
          eligible: true,
          checkin: { completedAt: '2026-01-01' },
          otherParticipant: null,
        },
      } as any);
      await setup({ conversation: buildConversation() });
      expect(screen.queryByTestId('checkin')).toBeNull();
    });
  });

  describe('AI assistant chip and banner', () => {
    it('offers the AI chip among the quick replies, opening the assistant with auto-start without touching the editor', async () => {
      const { store } = await setup({ conversation: buildConversation() });
      fireEvent.click(screen.getByTestId('suggestions-quick-replies-ai'));
      expect(store.getState().messaging.newMessage).toBe('');
      expect(store.getState().messaging.isAIPanelOpen).toBe(true);
      expect(store.getState().messaging.shouldAutoStartAI).toBe(true);
    });

    it('does not show the AI assistant banner at the first candidate message', async () => {
      await setup({
        conversation: buildConversation({
          messages: [message('m1', 'other', 1)],
        }),
      });
      expect(
        screen.getByTestId('suggestions-quick-replies')
      ).toBeInTheDocument();
      expect(screen.queryByTestId('ai-banner')).toBeNull();
    });

    it('shows the AI assistant banner once a second candidate message arrives unanswered', async () => {
      await setup({ conversation: buildConversation() });
      expect(screen.getByTestId('ai-banner')).toBeInTheDocument();
    });

    it('hides the AI assistant banner once the coach has replied', async () => {
      await setup({
        conversation: buildConversation({
          messages: [
            message('m3', 'me', 3),
            message('m2', 'other', 2),
            message('m1', 'other', 1),
          ],
        }),
      });
      expect(screen.queryByTestId('ai-banner')).toBeNull();
    });

    it('hides the AI assistant banner for a conversation where it was dismissed', async () => {
      await setup({
        conversation: buildConversation({
          assistantBannerDismissedAt: '2026-01-01T00:00:00.000Z',
        }),
      });
      expect(screen.queryByTestId('ai-banner')).toBeNull();
    });

    it('opens the assistant with auto-start from the banner', async () => {
      const { store } = await setup({ conversation: buildConversation() });
      fireEvent.click(screen.getByTestId('ai-banner-open'));
      expect(store.getState().messaging.isAIPanelOpen).toBe(true);
      expect(store.getState().messaging.shouldAutoStartAI).toBe(true);
    });

    it('dismisses the banner, persisted via the API, without affecting another conversation', async () => {
      mockedApi.dismissAIAssistantBanner.mockResolvedValue({} as any);
      await setup({ conversation: buildConversation() });
      fireEvent.click(screen.getByTestId('ai-banner-dismiss'));
      await settle();
      expect(mockedApi.dismissAIAssistantBanner).toHaveBeenCalledWith('conv1');
      expect(screen.queryByTestId('ai-banner')).toBeNull();
    });

    it('shows the banner in a compact layout on mobile', async () => {
      mockUseIsMobile.mockReturnValue(true);
      await setup({ conversation: buildConversation() });
      expect(screen.getByTestId('ai-banner')).toHaveTextContent('compact');
    });
  });

  describe('pinned information', () => {
    it('pins an "unavailable" notice when the addressee is unavailable', async () => {
      await setup({
        conversation: buildConversation({
          participants: [
            participant('me', UserRoles.COACH),
            participant('other', UserRoles.CANDIDATE, {
              userProfile: { hasPicture: false, unavailableAt: '2026-01-01' },
            }),
          ],
        }),
      });
      expect(screen.getByTestId('pinned')).toHaveTextContent(
        'ADDRESSEE_UNAVAILABLE'
      );
    });

    it('pins a "deleted" notice and makes the editor readonly when the addressee was deleted', async () => {
      await setup({
        conversation: buildConversation({
          participants: [
            participant('me', UserRoles.COACH),
            participant('other', UserRoles.CANDIDATE, { userProfile: null }),
          ],
        }),
      });
      expect(screen.getByTestId('pinned')).toHaveTextContent(
        'ADDRESSEE_DELETED'
      );
      expect(screen.getByTestId('editor')).toHaveTextContent('true');
      expect(screen.queryByTestId('waiting')).toBeNull();
    });
  });

  describe('AI assistant panel', () => {
    const open = (store: ReturnType<typeof createTestStore>) =>
      store.dispatch(messagingActions.setIsAIPanelOpen(true));

    it('shows the panel beside the conversation on desktop for a coach talking to a candidate', async () => {
      await setup({ conversation: buildConversation(), prepare: open });
      expect(screen.getByTestId('ai-panel')).toBeInTheDocument();
      expect(screen.getByTestId('editor')).toBeInTheDocument();
    });

    it('does not offer the panel to candidates', async () => {
      await setup({
        role: UserRoles.CANDIDATE,
        conversation: buildConversation({
          participants: [
            participant('me', UserRoles.CANDIDATE),
            participant('other', UserRoles.COACH),
          ],
        }),
        prepare: open,
      });
      expect(screen.queryByTestId('ai-panel')).toBeNull();
    });

    it('does not show the panel when it is closed or for a new conversation', async () => {
      await setup({ conversation: buildConversation() });
      expect(screen.queryByTestId('ai-panel')).toBeNull();
      cleanup();
      await setup({
        selected: 'new',
        prepare: (store) => {
          open(store);
          store.dispatch(
            messagingActions.setNewConversationDraft([
              participant('other', UserRoles.CANDIDATE),
            ] as any)
          );
        },
      });
      expect(screen.queryByTestId('ai-panel')).toBeNull();
    });

    it('shows the panel in a mid-height sheet on mobile, with the conversation still visible above', async () => {
      mockUseIsMobile.mockReturnValue(true);
      await setup({ conversation: buildConversation(), prepare: open });
      expect(screen.getByTestId('ai-panel')).toBeInTheDocument();
      expect(screen.getByTestId('editor')).toBeInTheDocument();
      expect(screen.getAllByTestId('message')).toHaveLength(2);
    });
  });

  describe('polling', () => {
    it('fetches only the messages newer than the latest one and refreshes the list every interval', async () => {
      await setup({ conversation: buildConversation() });
      mockedApi.getConversationById.mockClear();
      mockedApi.getConversations.mockClear();
      mockedApi.getConversationById.mockResolvedValue({
        data: { messages: [] },
      } as any);

      await act(async () => {
        await jest.advanceTimersByTimeAsync(DELAY_REFRESH_CONVERSATIONS);
      });

      expect(mockedApi.getConversationById).toHaveBeenCalledWith('conv1', {
        after: encodeMessageCursor(message('m2', 'other', 2)),
      });
      expect(mockedApi.getConversations).toHaveBeenCalledTimes(1);
    });

    it('only refreshes the list when there is no conversation open', async () => {
      await setup({ selected: null });
      mockedApi.getConversations.mockClear();
      await act(async () => {
        await jest.advanceTimersByTimeAsync(DELAY_REFRESH_CONVERSATIONS);
      });
      expect(mockedApi.getConversationById).not.toHaveBeenCalled();
      expect(mockedApi.getConversations).toHaveBeenCalledTimes(1);
    });

    it('stops polling once unmounted', async () => {
      const { unmount } = await setup({ conversation: buildConversation() });
      unmount();
      mockedApi.getConversations.mockClear();
      await act(async () => {
        await jest.advanceTimersByTimeAsync(DELAY_REFRESH_CONVERSATIONS * 2);
      });
      expect(mockedApi.getConversations).not.toHaveBeenCalled();
    });
  });

  describe('infinite scroll towards older messages', () => {
    const scrollContainer = () =>
      screen.getAllByTestId('message')[0].parentElement as HTMLElement;

    it('loads the page before the oldest message when scrolled to the top, and stops when the history is exhausted', async () => {
      await setup({ conversation: buildConversation() });
      mockedApi.getConversationById.mockClear();
      mockedApi.getConversationById.mockResolvedValue({
        data: { messages: [message('m0', 'other', 0)] },
      } as any);

      await act(async () => {
        fireEvent.scroll(scrollContainer());
        await jest.advanceTimersByTimeAsync(0);
      });
      expect(mockedApi.getConversationById).toHaveBeenCalledWith('conv1', {
        before: encodeMessageCursor(message('m1', 'other', 1)),
      });
      // older page shorter than a full page -> nothing more to load
      expect(
        screen.getAllByTestId('message').map((m) => m.textContent)
      ).toEqual(['m0', 'm1', 'm2']);

      mockedApi.getConversationById.mockClear();
      await act(async () => {
        fireEvent.scroll(scrollContainer());
        await jest.advanceTimersByTimeAsync(0);
      });
      expect(mockedApi.getConversationById).not.toHaveBeenCalled();
    });

    it('keeps loading while full pages are returned', async () => {
      await setup({ conversation: buildConversation() });
      mockedApi.getConversationById.mockClear();
      const fullPage = Array.from({ length: MESSAGES_PAGE_SIZE }, (_, i) =>
        message(`old${i}`, 'other', 0)
      );
      mockedApi.getConversationById.mockResolvedValue({
        data: { messages: fullPage },
      } as any);
      await act(async () => {
        fireEvent.scroll(scrollContainer());
        await jest.advanceTimersByTimeAsync(0);
      });
      mockedApi.getConversationById.mockClear();
      await act(async () => {
        fireEvent.scroll(scrollContainer());
        await jest.advanceTimersByTimeAsync(0);
      });
      expect(mockedApi.getConversationById).toHaveBeenCalledTimes(1);
    });

    it('ignores scroll events away from the top', async () => {
      await setup({ conversation: buildConversation() });
      mockedApi.getConversationById.mockClear();
      const container = scrollContainer();
      Object.defineProperty(container, 'scrollTop', {
        value: 500,
        configurable: true,
        writable: true,
      });
      await act(async () => {
        fireEvent.scroll(container);
        await jest.advanceTimersByTimeAsync(0);
      });
      expect(mockedApi.getConversationById).not.toHaveBeenCalled();
    });

    it('does not break when loading older messages fails', async () => {
      await setup({ conversation: buildConversation() });
      mockedApi.getConversationById.mockRejectedValue(new Error('boom'));
      await act(async () => {
        fireEvent.scroll(scrollContainer());
        await jest.advanceTimersByTimeAsync(0);
      });
      expect(screen.getAllByTestId('message')).toHaveLength(2);
    });
  });

  it('scrolls the messages container to the bottom when a conversation shows up', async () => {
    const scrollTo = jest.fn();
    const original = HTMLElement.prototype.scrollTo;
    HTMLElement.prototype.scrollTo = scrollTo as any;
    try {
      await setup({ conversation: buildConversation() });
      expect(scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'instant' })
      );
      // after a second the behaviour switches to smooth for new messages
      await act(async () => {
        await jest.advanceTimersByTimeAsync(1000);
      });
    } finally {
      HTMLElement.prototype.scrollTo = original;
    }
  });
});
