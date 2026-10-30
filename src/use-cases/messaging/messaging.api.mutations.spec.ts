jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  Conversation,
  ConversationType,
  Message,
  MessageType,
} from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { messagingApi } from './messaging.api';
import {
  selectConversationParticipantsAreDeleted,
  selectCurrentUserHasSentMessages,
  selectGetConversationsStatus,
  selectHasMessages,
  selectNewMessage,
  selectPostMessageStatus,
  selectSelectedConversation,
  selectIsAIPanelOpen,
  selectActivePanelView,
} from './messaging.selectors';
import { slice } from './messaging.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const message = (id: string, authorId = 'other'): Message =>
  ({
    id,
    authorId,
    content: id,
    type: MessageType.USER,
    createdAt: '2026-01-01T10:00:00.000Z',
  }) as Message;

const conversation = (
  id: string,
  messages: Message[] = [],
  extra: Partial<Conversation> = {}
): Conversation =>
  ({
    id,
    type: ConversationType.DIRECT,
    messages,
    participants: [],
    ...extra,
  }) as Conversation;

async function setup({
  list = [] as Conversation[],
  selected = null as Conversation | null,
}: { list?: Conversation[]; selected?: Conversation | null } = {}) {
  const store = createTestStore();
  await store.dispatch(
    messagingApi.util.upsertQueryData(
      'getConversations',
      undefined,
      list
    ) as any
  );
  if (selected) {
    await store.dispatch(
      messagingApi.util.upsertQueryData(
        'getSelectedConversation',
        selected.id,
        selected
      ) as any
    );
  }
  const read = (id: string) =>
    messagingApi.endpoints.getSelectedConversation.select(id)(
      store.getState() as any
    ).data;
  const readList = () =>
    messagingApi.endpoints.getConversations.select()(store.getState() as any)
      .data;
  return { store, read, readList };
}

describe('messaging api mutations', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getSelectedConversation', () => {
    it('refreshes the matching item of the conversations list', async () => {
      const { store, readList } = await setup({
        list: [conversation('c1'), conversation('c2')],
      });
      mockedApi.getConversationById.mockResolvedValue({
        data: conversation('c1', [message('m1')]),
      } as any);
      await store.dispatch(
        messagingApi.endpoints.getSelectedConversation.initiate('c1') as any
      );
      await flushPromises();
      expect(readList()?.[0].messages).toHaveLength(1);
      expect(readList()?.[1].messages).toHaveLength(0);
    });

    it('keeps the list untouched when the fetch fails', async () => {
      const { store, readList } = await setup({ list: [conversation('c1')] });
      mockedApi.getConversationById.mockRejectedValue(new Error('boom'));
      await store.dispatch(
        messagingApi.endpoints.getSelectedConversation.initiate('c1') as any
      );
      await flushPromises();
      expect(readList()?.[0].messages).toHaveLength(0);
    });
  });

  describe('loadOlderMessages', () => {
    it('appends the older page after the cached messages, without duplicates', async () => {
      const { store, read } = await setup({
        selected: conversation('c1', [message('m3'), message('m2')]),
      });
      mockedApi.getConversationById.mockResolvedValue({
        data: conversation('c1', [message('m2'), message('m1')]),
      } as any);

      const result = await store.dispatch(
        messagingApi.endpoints.loadOlderMessages.initiate({
          conversationId: 'c1',
          before: 'cursor',
        }) as any
      );

      expect(mockedApi.getConversationById).toHaveBeenCalledWith('c1', {
        before: 'cursor',
      });
      expect(result.data.map((m: Message) => m.id)).toEqual(['m2', 'm1']);
      expect(read('c1')?.messages.map((m) => m.id)).toEqual(['m3', 'm2', 'm1']);
    });

    it('leaves the cache untouched when the request fails', async () => {
      const { store, read } = await setup({
        selected: conversation('c1', [message('m3')]),
      });
      mockedApi.getConversationById.mockRejectedValue(new Error('boom'));
      const result = await store.dispatch(
        messagingApi.endpoints.loadOlderMessages.initiate({
          conversationId: 'c1',
          before: 'cursor',
        }) as any
      );
      expect(result.error).toBeDefined();
      expect(read('c1')?.messages.map((m) => m.id)).toEqual(['m3']);
    });
  });

  describe('pollConversationMessages', () => {
    it('prepends the new messages and marks the conversation as seen', async () => {
      mockedApi.markConversationSeen.mockResolvedValue({} as any);
      const { store, read } = await setup({
        selected: conversation('c1', [message('m1')]),
      });
      mockedApi.getConversationById.mockResolvedValue({
        data: conversation('c1', [message('m3'), message('m2'), message('m1')]),
      } as any);

      await store.dispatch(
        messagingApi.endpoints.pollConversationMessages.initiate({
          conversationId: 'c1',
          after: 'cursor',
        }) as any
      );
      await flushPromises();

      expect(mockedApi.getConversationById).toHaveBeenCalledWith('c1', {
        after: 'cursor',
      });
      expect(read('c1')?.messages.map((m) => m.id)).toEqual(['m3', 'm2', 'm1']);
      expect(mockedApi.markConversationSeen).toHaveBeenCalledWith('c1');
    });

    it('does nothing when there is no new message', async () => {
      const { store, read } = await setup({
        selected: conversation('c1', [message('m1')]),
      });
      mockedApi.getConversationById.mockResolvedValue({
        data: conversation('c1', []),
      } as any);
      await store.dispatch(
        messagingApi.endpoints.pollConversationMessages.initiate({
          conversationId: 'c1',
          after: 'cursor',
        }) as any
      );
      await flushPromises();
      expect(read('c1')?.messages).toHaveLength(1);
      expect(mockedApi.markConversationSeen).not.toHaveBeenCalled();
    });

    it('swallows a failing poll', async () => {
      const { store, read } = await setup({
        selected: conversation('c1', [message('m1')]),
      });
      mockedApi.getConversationById.mockRejectedValue(new Error('boom'));
      await store.dispatch(
        messagingApi.endpoints.pollConversationMessages.initiate({
          conversationId: 'c1',
          after: 'cursor',
        }) as any
      );
      await flushPromises();
      expect(read('c1')?.messages).toHaveLength(1);
    });
  });

  describe('markConversationSeen', () => {
    it('calls the API with the conversation id', async () => {
      mockedApi.markConversationSeen.mockResolvedValue({} as any);
      const { store } = await setup();
      const result = await store.dispatch(
        messagingApi.endpoints.markConversationSeen.initiate('c1') as any
      );
      expect(mockedApi.markConversationSeen).toHaveBeenCalledWith('c1');
      expect(result.error).toBeUndefined();
    });

    it('reports an error when the API fails', async () => {
      mockedApi.markConversationSeen.mockRejectedValue(new Error('boom'));
      const { store } = await setup();
      const result = await store.dispatch(
        messagingApi.endpoints.markConversationSeen.initiate('c1') as any
      );
      expect(result.error).toBeDefined();
    });
  });

  describe('archive and unarchive', () => {
    it('archives optimistically in the list and the selected conversation', async () => {
      mockedApi.archiveConversation.mockResolvedValue({} as any);
      const { store, read, readList } = await setup({
        list: [conversation('c1'), conversation('c2')],
        selected: conversation('c1'),
      });
      await store.dispatch(
        messagingApi.endpoints.archiveConversation.initiate('c1') as any
      );
      expect(mockedApi.archiveConversation).toHaveBeenCalledWith('c1');
      expect(readList()?.[0].archivedAt).toEqual(expect.any(String));
      expect(readList()?.[1].archivedAt).toBeUndefined();
      expect(read('c1')?.archivedAt).toEqual(expect.any(String));
    });

    it('rolls back the archiving when the API fails', async () => {
      mockedApi.archiveConversation.mockRejectedValue(new Error('boom'));
      const { store, read, readList } = await setup({
        list: [conversation('c1')],
        selected: conversation('c1'),
      });
      await store.dispatch(
        messagingApi.endpoints.archiveConversation.initiate('c1') as any
      );
      expect(readList()?.[0].archivedAt).toBeUndefined();
      expect(read('c1')?.archivedAt).toBeUndefined();
    });

    it('unarchives optimistically', async () => {
      mockedApi.unarchiveConversation.mockResolvedValue({} as any);
      const archived = { archivedAt: '2026-01-01T00:00:00.000Z' };
      const { store, read, readList } = await setup({
        list: [conversation('c1', [], archived)],
        selected: conversation('c1', [], archived),
      });
      await store.dispatch(
        messagingApi.endpoints.unarchiveConversation.initiate('c1') as any
      );
      expect(mockedApi.unarchiveConversation).toHaveBeenCalledWith('c1');
      expect(readList()?.[0].archivedAt).toBeNull();
      expect(read('c1')?.archivedAt).toBeNull();
    });

    it('rolls back the unarchiving when the API fails', async () => {
      mockedApi.unarchiveConversation.mockRejectedValue(new Error('boom'));
      const archived = { archivedAt: '2026-01-01T00:00:00.000Z' };
      const { store, read, readList } = await setup({
        list: [conversation('c1', [], archived)],
        selected: conversation('c1', [], archived),
      });
      await store.dispatch(
        messagingApi.endpoints.unarchiveConversation.initiate('c1') as any
      );
      expect(readList()?.[0].archivedAt).toBe(archived.archivedAt);
      expect(read('c1')?.archivedAt).toBe(archived.archivedAt);
    });
  });

  describe('dismissAIAssistantBanner', () => {
    it('dismisses optimistically in the list and the selected conversation', async () => {
      mockedApi.dismissAIAssistantBanner.mockResolvedValue({} as any);
      const { store, read, readList } = await setup({
        list: [conversation('c1'), conversation('c2')],
        selected: conversation('c1'),
      });
      await store.dispatch(
        messagingApi.endpoints.dismissAIAssistantBanner.initiate('c1') as any
      );
      expect(mockedApi.dismissAIAssistantBanner).toHaveBeenCalledWith('c1');
      expect(readList()?.[0].assistantBannerDismissedAt).toEqual(
        expect.any(String)
      );
      expect(readList()?.[1].assistantBannerDismissedAt).toBeUndefined();
      expect(read('c1')?.assistantBannerDismissedAt).toEqual(
        expect.any(String)
      );
    });

    it('rolls back the dismissal when the API fails', async () => {
      mockedApi.dismissAIAssistantBanner.mockRejectedValue(new Error('boom'));
      const { store, read, readList } = await setup({
        list: [conversation('c1')],
        selected: conversation('c1'),
      });
      await store.dispatch(
        messagingApi.endpoints.dismissAIAssistantBanner.initiate('c1') as any
      );
      expect(readList()?.[0].assistantBannerDismissedAt).toBeUndefined();
      expect(read('c1')?.assistantBannerDismissedAt).toBeUndefined();
    });
  });

  describe('selectors', () => {
    it('exposes the draft message and the AI panel state', () => {
      const store = createTestStore();
      store.dispatch(actions.setNewMessage('draft'));
      store.dispatch(actions.setActivePanelView('ai'));
      const state = store.getState() as any;
      expect(selectNewMessage(state)).toBe('draft');
      expect(selectIsAIPanelOpen(state)).toBe(true);
      expect(selectActivePanelView(state)).toBe('ai');
    });

    it('maps the request state of the conversations to a status', async () => {
      const idle = createTestStore();
      expect(selectGetConversationsStatus(idle.getState() as any)).toBe(
        ReduxRequestEvents.IDLE
      );

      const ok = createTestStore();
      mockedApi.getConversations.mockResolvedValue({ data: [] } as any);
      await ok.dispatch(
        messagingApi.endpoints.getConversations.initiate() as any
      );
      expect(selectGetConversationsStatus(ok.getState() as any)).toBe(
        ReduxRequestEvents.SUCCEEDED
      );

      const ko = createTestStore();
      mockedApi.getConversations.mockRejectedValue(new Error('boom'));
      await ko.dispatch(
        messagingApi.endpoints.getConversations.initiate() as any
      );
      expect(selectGetConversationsStatus(ko.getState() as any)).toBe(
        ReduxRequestEvents.FAILED
      );

      const pending = createTestStore();
      mockedApi.getConversations.mockReturnValue(new Promise(() => {}) as any);
      pending.dispatch(
        messagingApi.endpoints.getConversations.initiate() as any
      );
      expect(selectGetConversationsStatus(pending.getState() as any)).toBe(
        ReduxRequestEvents.REQUESTED
      );
    });

    it('maps the state of the message posting to a status', async () => {
      const store = createTestStore();
      expect(selectPostMessageStatus(store.getState() as any)).toBe(
        ReduxRequestEvents.IDLE
      );
      mockedApi.postMessage.mockResolvedValue({
        data: { conversation: conversation('c1'), id: 'm1' },
      } as any);
      store.dispatch(actions.postMessageRequested(new FormData()));
      await flushPromises();
      expect(selectPostMessageStatus(store.getState() as any)).toBe(
        ReduxRequestEvents.SUCCEEDED
      );
    });

    it('knows whether the user has any message to show', async () => {
      const { store } = await setup({ list: [] });
      expect(selectHasMessages(store.getState() as any)).toBe(false);
      store.dispatch(actions.selectConversation('new'));
      expect(selectHasMessages(store.getState() as any)).toBe(true);

      const loading = createTestStore();
      // conversations not loaded yet: assume there are some
      expect(selectHasMessages(loading.getState() as any)).toBe(true);

      const filled = await setup({ list: [conversation('c1')] });
      expect(selectHasMessages(filled.store.getState() as any)).toBe(true);
    });

    it('detects deleted participants (no profile) in the selected conversation', async () => {
      const { store } = await setup({
        selected: conversation('c1', [], {
          participants: [
            { id: 'a', userProfile: {} },
            { id: 'b', userProfile: null },
          ] as any,
        }),
      });
      store.dispatch(actions.selectConversation('c1'));
      expect(
        selectConversationParticipantsAreDeleted(store.getState() as any)
      ).toBe(true);

      const none = createTestStore();
      expect(
        selectConversationParticipantsAreDeleted(none.getState() as any)
      ).toBe(false);
    });

    it('knows whether the current user already wrote in the conversation', async () => {
      const { store } = await setup({
        selected: conversation('c1', [
          message('m1', 'me'),
          message('m2', 'other'),
        ]),
      });
      store.dispatch(actions.selectConversation('c1'));
      const state = store.getState() as any;
      expect(selectCurrentUserHasSentMessages('me')(state)).toBe(true);
      expect(selectCurrentUserHasSentMessages('someone')(state)).toBe(false);
      expect(selectCurrentUserHasSentMessages(null)(state)).toBe(false);
      expect(selectSelectedConversation(state)?.id).toBe('c1');
    });
  });
});
