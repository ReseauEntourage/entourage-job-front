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
  selectNewConversationDraft,
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

    it('notifies with a fallback message on a generic (non-axios) error', async () => {
      const store = createTestStore();
      mockedApi.postMessage.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.postMessageRequested(new FormData()));
      await flushPromises();

      expect(store.getState().notifications.notifications).toHaveLength(1);
      expect(store.getState().notifications.notifications[0]).toMatchObject({
        type: 'danger',
        message:
          "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
      });
    });

    it('notifies with the backend message when the elearning gate blocks the conversation', async () => {
      const store = createTestStore();
      mockedApi.postMessage.mockRejectedValue({
        isAxiosError: true,
        response: {
          status: 401,
          data: {
            message:
              "Vous devez terminer votre parcours de formation avant de pouvoir contacter d'autres membres. Rendez-vous sur la page Formations pour le compléter.",
          },
        },
      });

      store.dispatch(actions.postMessageRequested(new FormData()));
      await flushPromises();

      expect(store.getState().notifications.notifications[0]).toMatchObject({
        type: 'danger',
        message:
          "Vous devez terminer votre parcours de formation avant de pouvoir contacter d'autres membres. Rendez-vous sur la page Formations pour le compléter.",
      });
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

  /**
   * The draft used to be injected into the RTK Query cache under the `'new'`
   * key. Having no subscriber, it was garbage-collected after
   * `keepUnusedDataFor`, so a first message written in more than that delay
   * could never be sent — no request, no error, no trace anywhere.
   *
   * These tests run on the real store and the real `api` slice, so the
   * actual garbage collection runs. Mocking the cache away would make them
   * pass without ever reproducing the bug.
   */
  describe('new conversation draft lifetime', () => {
    // Far beyond any plausible `keepUnusedDataFor`, and deliberately not
    // hard-coding the library's default so the test survives a change to it.
    const WELL_PAST_CACHE_GC = 10 * 60 * 1000;

    const bindNewConversationWith = async (userId: string) => {
      const store = createTestStore();
      mockedApi.getConversations.mockResolvedValue({ data: [] } as any);
      mockedApi.getPublicUserProfile.mockResolvedValue({
        data: { id: userId, firstName: 'Jane', lastName: 'Doe', role: 'Coach' },
      } as any);

      store.dispatch(actions.bindNewConversationRequested(userId));
      await flushPromises();

      return store;
    };

    it('keeps the addressee readable long after the cache would have been collected', async () => {
      jest.useFakeTimers();
      try {
        const store = createTestStore();
        mockedApi.getConversations.mockResolvedValue({ data: [] } as any);
        mockedApi.getPublicUserProfile.mockResolvedValue({
          data: {
            id: 'user-99',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'Coach',
          },
        } as any);

        store.dispatch(actions.bindNewConversationRequested('user-99'));
        await jest.advanceTimersByTimeAsync(0);

        await jest.advanceTimersByTimeAsync(WELL_PAST_CACHE_GC);

        // Both the send path (participant ids) and the header (addressee
        // display) read through this selector: before the fix it returned
        // null here, blanking the header and turning send into a no-op.
        expect(selectSelectedConversationId(store.getState())).toBe('new');
        expect(
          selectSelectedConversation(store.getState())?.participants[0].id
        ).toBe('user-99');
      } finally {
        jest.useRealTimers();
      }
    });

    it('discards the draft when another conversation is selected', async () => {
      const store = await bindNewConversationWith('user-99');

      store.dispatch(actions.selectConversation('some-other-conversation'));

      expect(selectNewConversationDraft(store.getState())).toBeNull();
    });

    it('discards the draft when the selection is cleared', async () => {
      const store = await bindNewConversationWith('user-99');

      store.dispatch(actions.selectConversation(null));

      expect(selectNewConversationDraft(store.getState())).toBeNull();
    });

    it('discards the draft once the conversation has been created', async () => {
      const store = await bindNewConversationWith('user-99');
      mockedApi.postMessage.mockResolvedValue({
        data: {
          id: 'message-1',
          conversation: buildConversation({ id: 'created-conv' }),
        },
      } as any);

      const formData = new FormData();
      formData.append('content', 'Bonjour');
      formData.append('participantIds[]', 'user-99');
      store.dispatch(actions.postMessageRequested(formData));
      await flushPromises();

      expect(selectNewConversationDraft(store.getState())).toBeNull();
      expect(selectSelectedConversationId(store.getState())).toBe(
        'created-conv'
      );
    });
  });

  /**
   * Guards the other half of the fix. The listener used to `initiate()`
   * without ever releasing the subscription, which kept every visited
   * conversation cached forever and hid the fact that no component
   * subscribed. Now that the leak is gone, the cache entry's lifetime rests
   * entirely on `MessagingConversation`'s `useGetSelectedConversationQuery`
   * subscription — so that subscription had better hold.
   */
  describe('existing conversation cache lifetime', () => {
    const WELL_PAST_CACHE_GC = 10 * 60 * 1000;

    it('keeps the conversation readable past the collection window while a subscriber is mounted', async () => {
      jest.useFakeTimers();
      try {
        const store = createTestStore();
        const conversation = buildConversation({ id: 'conv-7' });
        mockedApi.getConversationById.mockResolvedValue({
          data: conversation,
        } as any);
        store.dispatch(actions.selectConversation('conv-7'));

        // Stands in for the mounted component's query hook.
        const subscription = store.dispatch(
          messagingApi.endpoints.getSelectedConversation.initiate('conv-7')
        );
        await jest.advanceTimersByTimeAsync(0);
        await jest.advanceTimersByTimeAsync(WELL_PAST_CACHE_GC);

        expect(selectSelectedConversation(store.getState())?.id).toBe('conv-7');

        subscription.unsubscribe();
      } finally {
        jest.useRealTimers();
      }
    });

    it('does not keep the entry alive through the listener alone', async () => {
      jest.useFakeTimers();
      try {
        const store = createTestStore();
        mockedApi.getConversationById.mockResolvedValue({
          data: buildConversation({ id: 'conv-7' }),
        } as any);
        store.dispatch(actions.selectConversation('conv-7'));

        // The forced refresh must not, on its own, pin the entry: that was
        // the leak.
        store.dispatch(actions.getSelectedConversationRequested());
        await jest.advanceTimersByTimeAsync(0);
        expect(selectSelectedConversation(store.getState())?.id).toBe('conv-7');

        await jest.advanceTimersByTimeAsync(WELL_PAST_CACHE_GC);

        expect(selectSelectedConversation(store.getState())).toBeNull();
      } finally {
        jest.useRealTimers();
      }
    });
  });

  /**
   * Same contract for the conversation list and the unread badge. Their
   * listeners used to leak a subscription per trigger — and the messaging
   * screen triggers a refresh every 30s, so they piled up for the whole
   * session. Now non-subscribing, their cache lifetime rests on
   * `MessagingConversationList` / `MessagingConversation` and on
   * `NavConnected` respectively.
   */
  describe('conversation list and unread count cache lifetime', () => {
    const WELL_PAST_CACHE_GC = 10 * 60 * 1000;

    it('keeps the conversation list alive while a subscriber is mounted', async () => {
      jest.useFakeTimers();
      try {
        const store = createTestStore();
        mockedApi.getConversations.mockResolvedValue({
          data: [buildConversation({ id: 'conv-1' })],
        } as any);

        // Stands in for the mounted list's query hook.
        const subscription = store.dispatch(
          messagingApi.endpoints.getConversations.initiate()
        );
        await jest.advanceTimersByTimeAsync(0);
        await jest.advanceTimersByTimeAsync(WELL_PAST_CACHE_GC);

        expect(selectConversations(store.getState())).toHaveLength(1);

        subscription.unsubscribe();
      } finally {
        jest.useRealTimers();
      }
    });

    it('does not pin the list or the unread count through the listeners alone', async () => {
      jest.useFakeTimers();
      try {
        const store = createTestStore();
        mockedApi.getConversations.mockResolvedValue({
          data: [buildConversation({ id: 'conv-1' })],
        } as any);
        mockedApi.getUnseenConversationsCount.mockResolvedValue({
          data: 3,
        } as any);

        store.dispatch(actions.getConversationsRequested());
        store.dispatch(actions.getUnseenConversationsCountRequested());
        await jest.advanceTimersByTimeAsync(0);
        expect(selectConversations(store.getState())).toHaveLength(1);
        expect(selectUnseenConversationCount(store.getState())).toBe(3);

        await jest.advanceTimersByTimeAsync(WELL_PAST_CACHE_GC);

        // Collected, because the forced refresh no longer subscribes. On a
        // real screen the mounted components hold the subscription.
        expect(selectConversations(store.getState())).toBeNull();
        expect(selectUnseenConversationCount(store.getState())).toBe(0);
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
