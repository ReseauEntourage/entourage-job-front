// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  Conversation,
  ConversationParticipant,
  ConversationType,
  Message,
  MessageWithConversation,
} from '@/src/api/types';
import { slice } from './messaging.slice';

const { actions, reducer } = slice;

const buildParticipant = (
  overrides: Partial<ConversationParticipant> = {}
): ConversationParticipant =>
  ({
    id: 'participant-1',
    firstName: 'Jane',
    lastName: 'Doe',
    userProfile: null,
    conversationParticipant: {
      id: 'cp-1',
      seenAt: '2020-01-01T00:00:00.000Z',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    },
    ...overrides,
  }) as ConversationParticipant;

const buildMessage = (overrides: Partial<Message> = {}): Message =>
  ({
    id: `msg-${Math.random()}`,
    content: 'Hello',
    authorId: 'author-1',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    conversationId: 'conversation-1',
    medias: [],
    ...overrides,
  }) as Message;

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

const buildMessageWithConversation = (
  overrides: Partial<MessageWithConversation> = {}
): MessageWithConversation =>
  ({
    ...buildMessage(),
    conversation: buildConversation(),
    ...overrides,
  }) as MessageWithConversation;

describe('messaging slice', () => {
  describe('getConversationsSucceeded', () => {
    it('stores the fetched conversations', () => {
      const conversations = [buildConversation({ id: 'conv-1' })];

      const state = reducer(
        slice.getInitialState(),
        actions.getConversationsSucceeded(conversations)
      );

      expect(state.conversations).toEqual(conversations);
    });
  });

  describe('getUnseenConversationsCountSucceeded', () => {
    it('stores the unseen conversation count', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.getUnseenConversationsCountSucceeded(5)
      );

      expect(state.unseenConversationCount).toBe(5);
    });
  });

  describe('bindNewConversationSucceeded', () => {
    it('selects the existing direct conversation when the required participant already has one', () => {
      const existingParticipant = buildParticipant({ id: 'user-2' });
      const existingConversation = buildConversation({
        id: 'existing-conv',
        type: ConversationType.DIRECT,
        participants: [existingParticipant],
      });
      const initialState = {
        ...slice.getInitialState(),
        conversations: [existingConversation],
        selectedConversationId: null,
      };

      const state = reducer(
        initialState,
        actions.bindNewConversationSucceeded([
          buildParticipant({ id: 'user-2' }),
        ])
      );

      expect(state.selectedConversationId).toBe('existing-conv');
      expect(state.selectedConversation).toBeNull();
    });

    it('creates a new direct conversation when there is a single required participant with no existing conversation', () => {
      const participant = buildParticipant({ id: 'user-3' });
      const initialState = {
        ...slice.getInitialState(),
        conversations: null,
      };

      const state = reducer(
        initialState,
        actions.bindNewConversationSucceeded([participant])
      );

      expect(state.selectedConversationId).toBe('new');
      expect(state.selectedConversation?.type).toBe(ConversationType.DIRECT);
      expect(state.selectedConversation?.participants).toEqual([participant]);
      expect(state.selectedConversation?.messages).toEqual([]);
    });

    it('creates a new group conversation when there are multiple required participants with no existing conversation', () => {
      const participants = [
        buildParticipant({ id: 'user-4' }),
        buildParticipant({ id: 'user-5' }),
      ];
      const initialState = {
        ...slice.getInitialState(),
        conversations: [],
      };

      const state = reducer(
        initialState,
        actions.bindNewConversationSucceeded(participants)
      );

      expect(state.selectedConversationId).toBe('new');
      expect(state.selectedConversation?.type).toBe(ConversationType.GROUP);
      expect(state.selectedConversation?.participants).toEqual(participants);
    });
  });

  describe('postMessageSucceeded', () => {
    it('selects the new conversation and prepends it to the list when starting a new conversation', () => {
      const existingConversation = buildConversation({ id: 'existing-conv' });
      const newConversation = buildConversation({ id: 'new-conv' });
      const message = buildMessageWithConversation({
        conversation: newConversation,
      });
      const initialState = {
        ...slice.getInitialState(),
        conversations: [existingConversation],
      };

      const state = reducer(
        initialState,
        actions.postMessageSucceeded({ message, isNewConversation: true })
      );

      expect(state.selectedConversationId).toBe('new-conv');
      expect(state.conversations).toHaveLength(2);
      expect(state.conversations?.[0]).toEqual({
        ...newConversation,
        messages: [message],
      });
      expect(state.conversations?.[1]).toEqual(existingConversation);
    });

    it('selects the new conversation without touching the list when conversations have not loaded yet', () => {
      const newConversation = buildConversation({ id: 'new-conv' });
      const message = buildMessageWithConversation({
        conversation: newConversation,
      });
      const initialState = { ...slice.getInitialState(), conversations: null };

      const state = reducer(
        initialState,
        actions.postMessageSucceeded({ message, isNewConversation: true })
      );

      expect(state.selectedConversationId).toBe('new-conv');
      expect(state.conversations).toBeNull();
    });

    it('appends the message, marks it seen for the author, and moves the conversation to the top', () => {
      const author = buildParticipant({ id: 'author-1' });
      const targetConversation = buildConversation({
        id: 'conv-2',
        participants: [author],
        messages: [],
      });
      const otherConversation = buildConversation({ id: 'conv-1' });
      const selectedConversation = buildConversation({
        id: 'conv-2',
        participants: [author],
        messages: [],
      });
      const message = buildMessageWithConversation({
        authorId: 'author-1',
        createdAt: '2026-05-01T00:00:00.000Z',
        conversation: targetConversation,
      });
      const initialState = {
        ...slice.getInitialState(),
        conversations: [otherConversation, targetConversation],
        selectedConversationId: 'conv-2',
        selectedConversation,
      };

      const state = reducer(
        initialState,
        actions.postMessageSucceeded({ message, isNewConversation: false })
      );

      expect(state.conversations?.map((c) => c.id)).toEqual([
        'conv-2',
        'conv-1',
      ]);
      expect(state.conversations?.[0].messages[0]).toEqual(message);
      expect(
        state.conversations?.[0].participants[0].conversationParticipant.seenAt
      ).toBe('2026-05-01T00:00:00.000Z');
      expect(state.selectedConversation?.messages[0]).toEqual(message);
    });

    it('is a no-op on the conversation list when conversations have not loaded yet for an existing conversation', () => {
      const message = buildMessageWithConversation();
      const initialState = {
        ...slice.getInitialState(),
        conversations: null,
        selectedConversationId: 'conv-2',
      };

      const state = reducer(
        initialState,
        actions.postMessageSucceeded({ message, isNewConversation: false })
      );

      expect(state.conversations).toBeNull();
    });
  });

  describe('getSelectedConversationSucceeded', () => {
    it('sets the selected conversation and updates it within the conversation list', () => {
      const oldVersion = buildConversation({ id: 'conv-1', messages: [] });
      const updated = buildConversation({
        id: 'conv-1',
        messages: [buildMessage()],
      });
      const initialState = {
        ...slice.getInitialState(),
        conversations: [oldVersion],
        selectedConversationId: 'conv-1',
      };

      const state = reducer(
        initialState,
        actions.getSelectedConversationSucceeded(updated)
      );

      expect(state.selectedConversation).toEqual(updated);
      expect(state.conversations?.[0]).toEqual(updated);
    });

    it('sets the selected conversation without touching the list when conversations have not loaded yet', () => {
      const updated = buildConversation({ id: 'conv-1' });
      const initialState = { ...slice.getInitialState(), conversations: null };

      const state = reducer(
        initialState,
        actions.getSelectedConversationSucceeded(updated)
      );

      expect(state.selectedConversation).toEqual(updated);
      expect(state.conversations).toBeNull();
    });
  });

  describe('plain reducers', () => {
    it('selectConversation sets selectedConversationId', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.selectConversation('conv-1')
      );

      expect(state.selectedConversationId).toBe('conv-1');
    });

    it('setQuery sets query', () => {
      const state = reducer(slice.getInitialState(), actions.setQuery('hi'));

      expect(state.query).toBe('hi');
    });

    it('setPinnedInfo sets pinnedInfo', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.setPinnedInfo('ADDRESSEE_UNAVAILABLE')
      );

      expect(state.pinnedInfo).toBe('ADDRESSEE_UNAVAILABLE');
    });

    it('setNewMessage sets newMessage', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.setNewMessage('draft text')
      );

      expect(state.newMessage).toBe('draft text');
    });

    it('setIsAIPanelOpen sets isAIPanelOpen', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.setIsAIPanelOpen(true)
      );

      expect(state.isAIPanelOpen).toBe(true);
    });

    it('setActivePanelView sets the active view and opens the AI panel', () => {
      const initialState = {
        ...slice.getInitialState(),
        isAIPanelOpen: false,
      };

      const state = reducer(initialState, actions.setActivePanelView('ai'));

      expect(state.activePanelView).toBe('ai');
      expect(state.isAIPanelOpen).toBe(true);
    });
  });

  describe('postFeedbackSucceeded', () => {
    it('marks the selected conversation as not needing feedback anymore', () => {
      const selectedConversation = buildConversation({
        shouldGiveFeedback: true,
      });
      const initialState = {
        ...slice.getInitialState(),
        selectedConversation,
      };

      const state = reducer(initialState, actions.postFeedbackSucceeded());

      expect(state.selectedConversation?.shouldGiveFeedback).toBe(false);
    });

    it('is a no-op when there is no selected conversation', () => {
      const initialState = {
        ...slice.getInitialState(),
        selectedConversation: null,
      };

      const state = reducer(initialState, actions.postFeedbackSucceeded());

      expect(state.selectedConversation).toBeNull();
    });
  });
});
