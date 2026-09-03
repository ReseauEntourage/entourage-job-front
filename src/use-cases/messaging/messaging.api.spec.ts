jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Conversation, ConversationType } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { messagingApi } from './messaging.api';
import {
  selectConversations,
  selectSelectedConversation,
  selectSelectedConversationId,
  selectUnseenConversationCount,
} from './messaging.selectors';
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

describe('messaging api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getConversationsRequested (trigger listener)', () => {
    it('stores the fetched conversations on success', async () => {
      const store = createTestStore();
      const conversations = [buildConversation({ id: 'conv-1' })];
      mockedApi.getConversations.mockResolvedValue({
        data: conversations,
      } as any);

      store.dispatch(actions.getConversationsRequested());
      await flushPromises();

      expect(selectConversations(store.getState())).toEqual(conversations);
    });

    it('surfaces no conversations when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getConversations.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.getConversationsRequested());
      await flushPromises();

      expect(selectConversations(store.getState())).toBeNull();
    });
  });

  describe('getUnseenConversationsCountRequested (trigger listener)', () => {
    it('stores the unseen conversation count on success', async () => {
      const store = createTestStore();
      mockedApi.getUnseenConversationsCount.mockResolvedValue({
        data: 3,
      } as any);

      store.dispatch(actions.getUnseenConversationsCountRequested());
      await flushPromises();

      expect(selectUnseenConversationCount(store.getState())).toBe(3);
    });
  });

  describe('getSelectedConversationRequested (trigger listener)', () => {
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
      expect(selectSelectedConversation(store.getState())).toEqual(
        conversation
      );
    });

    it('does not call the API when there is no selected conversation', async () => {
      const store = createTestStore();

      store.dispatch(actions.getSelectedConversationRequested());
      await flushPromises();

      expect(mockedApi.getConversationById).not.toHaveBeenCalled();
    });
  });

  describe('postMessageRequested (trigger listener)', () => {
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

      expect(selectSelectedConversationId(store.getState())).toBe('new-conv');
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
          selectedConversationId: 'conv-2',
        },
      });
      mockedApi.getConversations.mockResolvedValue({
        data: [otherConversation, targetConversation],
      } as any);
      await store.dispatch(messagingApi.endpoints.getConversations.initiate());
      mockedApi.getConversationById.mockResolvedValue({
        data: targetConversation,
      } as any);
      await store.dispatch(
        messagingApi.endpoints.getSelectedConversation.initiate('conv-2')
      );

      const formData = new FormData();
      formData.append('conversationId', 'conv-2');
      mockedApi.postMessage.mockResolvedValue({
        data: {
          id: 'msg-1',
          authorId: 'author-1',
          createdAt: '2026-01-01T00:00:00.000Z',
          conversation: { id: 'conv-2' },
        },
      } as any);

      store.dispatch(actions.postMessageRequested(formData));
      await flushPromises();

      const conversations = selectConversations(store.getState());
      expect(conversations?.map((c) => c.id)).toEqual(['conv-2', 'conv-1']);
      expect(conversations?.[0].messages).toHaveLength(1);
      expect(
        selectSelectedConversation(store.getState())?.messages
      ).toHaveLength(1);
    });

    it('does not notify on a generic error', async () => {
      const store = createTestStore();
      mockedApi.postMessage.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.postMessageRequested(new FormData()));
      await flushPromises();

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

      expect(store.getState().notifications.notifications).toHaveLength(1);
    });
  });

  describe('bindNewConversationRequested (trigger listener)', () => {
    it('fetches the conversations without creating a new one when no participant is required', async () => {
      const store = createTestStore();
      const conversations = [buildConversation({ id: 'conv-1' })];
      mockedApi.getConversations.mockResolvedValue({
        data: conversations,
      } as any);

      store.dispatch(actions.bindNewConversationRequested(''));
      await flushPromises();

      expect(selectConversations(store.getState())).toEqual(conversations);
      expect(mockedApi.getPublicUserProfile).not.toHaveBeenCalled();
      expect(selectSelectedConversationId(store.getState())).toBeNull();
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

      expect(selectSelectedConversationId(store.getState())).toBe(
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

      expect(selectSelectedConversationId(store.getState())).toBe('new');
      expect(
        selectSelectedConversation(store.getState())?.participants[0].id
      ).toBe('user-99');
    });
  });
});
