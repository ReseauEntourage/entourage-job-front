jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Conversation, ConversationType } from '@/src/api/types';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { messagingApi } from './messaging.api';
import {
  selectAIAssistantRecipientId,
  selectOtherParticipantHasNotReplied,
} from './messaging.selectors';
import { slice } from './messaging.slice';

const CONVERSATION_ID = 'conversation-1';

const buildState = async (selectedConversation: Conversation | null) => {
  const store = createTestStore({
    messaging: {
      ...slice.getInitialState(),
      selectedConversationId: selectedConversation ? CONVERSATION_ID : null,
    },
  });
  if (selectedConversation) {
    // `upsertQueryData`'s dispatch resolves asynchronously (it goes through
    // the same pipeline as a real fetch) — the cache isn't updated until
    // this settles.
    await store.dispatch(
      messagingApi.util.upsertQueryData(
        'getSelectedConversation',
        CONVERSATION_ID,
        selectedConversation
      )
    );
  }
  return store.getState();
};

const buildMessage = (authorId: string) =>
  ({
    id: `msg-${authorId}-${Math.random()}`,
    authorId,
  }) as Conversation['messages'][number];

const buildConversation = (overrides: Partial<Conversation>): Conversation =>
  ({
    id: CONVERSATION_ID,
    type: ConversationType.DIRECT,
    messages: [],
    participants: [],
    ...overrides,
  }) as Conversation;

describe('selectOtherParticipantHasNotReplied', () => {
  const currentUserId = 'user-me';
  const otherUserId = 'user-other';

  it('is false when there is no selected conversation', async () => {
    const state = await buildState(null);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is false when currentUserId is null', async () => {
    const conversation = buildConversation({
      messages: [buildMessage(currentUserId)],
    });
    const state = await buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(null)(state)).toBe(false);
  });

  it('is false for a group conversation, even if only the current user has sent messages', async () => {
    const conversation = buildConversation({
      type: ConversationType.GROUP,
      messages: [buildMessage(currentUserId)],
    });
    const state = await buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is false when the conversation has no messages yet', async () => {
    const conversation = buildConversation({ messages: [] });
    const state = await buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is true when every message was sent by the current user', async () => {
    const conversation = buildConversation({
      messages: [buildMessage(currentUserId), buildMessage(currentUserId)],
    });
    const state = await buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      true
    );
  });

  it('is false once the other participant has replied', async () => {
    const conversation = buildConversation({
      messages: [buildMessage(currentUserId), buildMessage(otherUserId)],
    });
    const state = await buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is false when the other participant sent the only message (recipient view)', async () => {
    const conversation = buildConversation({
      messages: [buildMessage(otherUserId)],
    });
    const state = await buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });
});

describe('selectAIAssistantRecipientId', () => {
  const participant = (id: string, role: UserRoles) =>
    ({ id, role }) as Conversation['participants'][number];

  it('is the candidate of a direct conversation, other than the current user', async () => {
    const state = await buildState(
      buildConversation({
        participants: [
          participant('me', UserRoles.COACH),
          participant('cand', UserRoles.CANDIDATE),
        ],
      })
    );

    expect(selectAIAssistantRecipientId('me')(state)).toBe('cand');
  });

  it('is the recipient held by the draft of a conversation being created', () => {
    const store = createTestStore({
      messaging: {
        ...slice.getInitialState(),
        selectedConversationId: 'new',
        newConversationDraft: [participant('cand', UserRoles.CANDIDATE)],
      },
    });

    expect(selectAIAssistantRecipientId('me')(store.getState())).toBe('cand');
  });

  it('is null when no conversation is selected or the current user is unknown', async () => {
    const state = await buildState(null);

    expect(selectAIAssistantRecipientId('me')(state)).toBeNull();
    expect(
      selectAIAssistantRecipientId(null)(
        await buildState(
          buildConversation({
            participants: [participant('cand', UserRoles.CANDIDATE)],
          })
        )
      )
    ).toBeNull();
  });

  it('is null for a group conversation', async () => {
    const state = await buildState(
      buildConversation({
        type: ConversationType.GROUP,
        participants: [
          participant('me', UserRoles.COACH),
          participant('cand', UserRoles.CANDIDATE),
          participant('other', UserRoles.COACH),
        ],
      })
    );

    expect(selectAIAssistantRecipientId('me')(state)).toBeNull();
  });

  it('is null when the other participant is not a candidate', async () => {
    const state = await buildState(
      buildConversation({
        participants: [
          participant('me', UserRoles.COACH),
          participant('coach', UserRoles.COACH),
        ],
      })
    );

    expect(selectAIAssistantRecipientId('me')(state)).toBeNull();
  });
});
