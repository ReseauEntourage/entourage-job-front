jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Conversation, ConversationType } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice } from './messaging.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildConversation = (
  overrides: Partial<Conversation> = {}
): Conversation =>
  ({
    id: 'conversation-1',
    type: ConversationType.DIRECT,
    messages: [],
    participants: [],
    ...overrides,
  }) as Conversation;

describe('messaging saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConversationsRequested', () => {
    it('stores the fetched conversations on success', async () => {
      const store = createTestStore();
      const conversations = [buildConversation({ id: 'conv-1' })];
      mockedApi.getConversations.mockResolvedValue({
        data: conversations,
      } as any);

      store.dispatch(actions.getConversationsRequested());
      await flushPromises();

      expect(store.getState().messaging.conversations).toEqual(conversations);
      expect(store.getState().messaging.getConversations.status).toBe(
        'SUCCEEDED'
      );
    });

    it('dispatches getConversationsFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getConversations.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.getConversationsRequested());
      await flushPromises();

      expect(store.getState().messaging.getConversations.status).toBe('FAILED');
      expect(store.getState().messaging.conversations).toBeNull();
    });
  });

  describe('getUnseenConversationsCountRequested', () => {
    it('stores the unseen conversation count on success', async () => {
      const store = createTestStore();
      mockedApi.getUnseenConversationsCount.mockResolvedValue({
        data: 3,
      } as any);

      store.dispatch(actions.getUnseenConversationsCountRequested());
      await flushPromises();

      expect(store.getState().messaging.unseenConversationCount).toBe(3);
    });

    it('dispatches getUnseenConversationsCountFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getUnseenConversationsCount.mockRejectedValue(
        new Error('boom')
      );

      store.dispatch(actions.getUnseenConversationsCountRequested());
      await flushPromises();

      expect(
        store.getState().messaging.getUnseenConversationsCount.status
      ).toBe('FAILED');
    });
  });

  describe('getSelectedConversationRequested', () => {
    it('fetches and stores the selected conversation when one is selected', async () => {
      const store = createTestStore({
        messaging: {
          ...slice.getInitialState(),
          selectedConversationId: 'conv-1',
        },
      });
      const conversation = buildConversation({ id: 'conv-1' });
      mockedApi.getConversationById.mockResolvedValue({
        data: conversation,
      } as any);

      store.dispatch(actions.getSelectedConversationRequested());
      await flushPromises();

      expect(mockedApi.getConversationById).toHaveBeenCalledWith('conv-1');
      expect(store.getState().messaging.selectedConversation).toEqual(
        conversation
      );
      expect(store.getState().messaging.getSelectedConversation.status).toBe(
        'SUCCEEDED'
      );
    });

    it('dispatches getSelectedConversationFailed without calling the API when there is no selected conversation', async () => {
      const store = createTestStore();

      store.dispatch(actions.getSelectedConversationRequested());
      await flushPromises();

      expect(mockedApi.getConversationById).not.toHaveBeenCalled();
      expect(store.getState().messaging.getSelectedConversation.status).toBe(
        'FAILED'
      );
    });

    it('dispatches getSelectedConversationFailed when the API call rejects', async () => {
      const store = createTestStore({
        messaging: {
          ...slice.getInitialState(),
          selectedConversationId: 'conv-1',
        },
      });
      mockedApi.getConversationById.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.getSelectedConversationRequested());
      await flushPromises();

      expect(store.getState().messaging.getSelectedConversation.status).toBe(
        'FAILED'
      );
    });
  });

  describe('postMessageRequested', () => {
    it('selects the newly created conversation when starting a new conversation', async () => {
      const store = createTestStore();
      const formData = new FormData();
      const newConversation = buildConversation({ id: 'new-conv' });
      mockedApi.postMessage.mockResolvedValue({
        data: {
          id: 'msg-1',
          authorId: 'author-1',
          createdAt: '2026-01-01T00:00:00.000Z',
          conversation: newConversation,
        },
      } as any);

      store.dispatch(actions.postMessageRequested(formData));
      await flushPromises();

      expect(store.getState().messaging.selectedConversationId).toBe(
        'new-conv'
      );
      expect(store.getState().messaging.postMessage.status).toBe('SUCCEEDED');
    });

    it('appends the message to the existing conversation and moves it to the top', async () => {
      const author = {
        id: 'author-1',
        conversationParticipant: { seenAt: null },
      } as any;
      const targetConversation = buildConversation({
        id: 'conv-2',
        participants: [author],
        messages: [],
      });
      const otherConversation = buildConversation({ id: 'conv-1' });
      const store = createTestStore({
        messaging: {
          ...slice.getInitialState(),
          conversations: [otherConversation, targetConversation],
          selectedConversationId: 'conv-2',
        },
      });
      const formData = new FormData();
      formData.append('conversationId', 'conv-2');
      mockedApi.postMessage.mockResolvedValue({
        data: {
          id: 'msg-1',
          authorId: 'author-1',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      } as any);

      store.dispatch(actions.postMessageRequested(formData));
      await flushPromises();

      const { conversations } = store.getState().messaging;
      expect(conversations?.map((c) => c.id)).toEqual(['conv-2', 'conv-1']);
      expect(conversations?.[0].messages).toHaveLength(1);
    });

    it('dispatches postMessageFailed without notifying on a generic error', async () => {
      const store = createTestStore();
      mockedApi.postMessage.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.postMessageRequested(new FormData()));
      await flushPromises();

      expect(store.getState().messaging.postMessage.status).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(0);
    });

    it('notifies the user when the daily conversation limit is reached', async () => {
      const store = createTestStore();
      mockedApi.postMessage.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 429,
          data: { message: 'DAILY_CONVERSATION_LIMIT_REACHED' },
        },
      });

      store.dispatch(actions.postMessageRequested(new FormData()));
      await flushPromises();

      expect(store.getState().messaging.postMessage.status).toBe('FAILED');
      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  describe('bindNewConversationRequested', () => {
    it('fetches the conversations without creating a new one when no participant is required', async () => {
      const store = createTestStore();
      const conversations = [buildConversation({ id: 'conv-1' })];
      mockedApi.getConversations.mockResolvedValue({
        data: conversations,
      } as any);

      store.dispatch(actions.bindNewConversationRequested(''));
      await flushPromises();

      expect(store.getState().messaging.conversations).toEqual(conversations);
      expect(mockedApi.getPublicUserProfile).not.toHaveBeenCalled();
      expect(store.getState().messaging.selectedConversationId).toBeNull();
    });

    it('selects the existing direct conversation with the required participant', async () => {
      const participant = {
        id: 'user-42',
        conversationParticipant: { seenAt: null },
      } as any;
      const existingConversation = buildConversation({
        id: 'existing-conv',
        type: ConversationType.DIRECT,
        participants: [participant],
      });
      const store = createTestStore();
      mockedApi.getConversations.mockResolvedValue({
        data: [existingConversation],
      } as any);
      mockedApi.getPublicUserProfile.mockResolvedValue({
        data: {
          id: 'user-42',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'CANDIDATE',
        },
      } as any);

      store.dispatch(actions.bindNewConversationRequested('user-42'));
      await flushPromises();

      expect(store.getState().messaging.selectedConversationId).toBe(
        'existing-conv'
      );
    });

    it('creates a new conversation when the required participant has none yet', async () => {
      const store = createTestStore();
      mockedApi.getConversations.mockResolvedValue({ data: [] } as any);
      mockedApi.getPublicUserProfile.mockResolvedValue({
        data: {
          id: 'user-99',
          firstName: 'John',
          lastName: 'Smith',
          role: 'CANDIDATE',
        },
      } as any);

      store.dispatch(actions.bindNewConversationRequested('user-99'));
      await flushPromises();

      expect(store.getState().messaging.selectedConversationId).toBe('new');
      expect(
        store.getState().messaging.selectedConversation?.participants[0].id
      ).toBe('user-99');
    });
  });

  describe('postFeedbackRequested', () => {
    it('marks the selected conversation as not needing feedback on success', async () => {
      const selectedConversation = buildConversation({
        shouldGiveFeedback: true,
      });
      const store = createTestStore({
        messaging: { ...slice.getInitialState(), selectedConversation },
      });
      mockedApi.postConversationFeedback.mockResolvedValue({} as any);

      store.dispatch(
        actions.postFeedbackRequested({
          conversationParticipantId: 'cp-1',
          rating: 5,
        })
      );
      await flushPromises();

      expect(
        store.getState().messaging.selectedConversation?.shouldGiveFeedback
      ).toBe(false);
    });

    it('leaves the selected conversation untouched when the API call rejects', async () => {
      const selectedConversation = buildConversation({
        shouldGiveFeedback: true,
      });
      const store = createTestStore({
        messaging: { ...slice.getInitialState(), selectedConversation },
      });
      mockedApi.postConversationFeedback.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.postFeedbackRequested({
          conversationParticipantId: 'cp-1',
          rating: 5,
        })
      );
      await flushPromises();

      expect(
        store.getState().messaging.selectedConversation?.shouldGiveFeedback
      ).toBe(true);
    });
  });
});
