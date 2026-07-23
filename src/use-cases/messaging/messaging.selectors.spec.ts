// eslint-disable-next-line import/no-named-as-default
import expect from 'expect';
import { Conversation, ConversationType } from 'src/api/types';
import { selectOtherParticipantHasNotReplied } from './messaging.selectors';
import { RootState } from './messaging.slice';

const buildState = (selectedConversation: Conversation | null): RootState =>
  ({
    messaging: { selectedConversation },
  } as unknown as RootState);

const buildMessage = (authorId: string) =>
  ({
    id: `msg-${authorId}-${Math.random()}`,
    authorId,
  } as Conversation['messages'][number]);

const buildConversation = (overrides: Partial<Conversation>): Conversation =>
  ({
    id: 'conversation-1',
    type: ConversationType.DIRECT,
    messages: [],
    participants: [],
    ...overrides,
  } as Conversation);

describe('selectOtherParticipantHasNotReplied', () => {
  const currentUserId = 'user-me';
  const otherUserId = 'user-other';

  it('is false when there is no selected conversation', () => {
    const state = buildState(null);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is false when currentUserId is null', () => {
    const conversation = buildConversation({
      messages: [buildMessage(currentUserId)],
    });
    const state = buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(null)(state)).toBe(false);
  });

  it('is false for a group conversation, even if only the current user has sent messages', () => {
    const conversation = buildConversation({
      type: ConversationType.GROUP,
      messages: [buildMessage(currentUserId)],
    });
    const state = buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is false when the conversation has no messages yet', () => {
    const conversation = buildConversation({ messages: [] });
    const state = buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is true when every message was sent by the current user', () => {
    const conversation = buildConversation({
      messages: [buildMessage(currentUserId), buildMessage(currentUserId)],
    });
    const state = buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      true
    );
  });

  it('is false once the other participant has replied', () => {
    const conversation = buildConversation({
      messages: [buildMessage(currentUserId), buildMessage(otherUserId)],
    });
    const state = buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });

  it('is false when the other participant sent the only message (recipient view)', () => {
    const conversation = buildConversation({
      messages: [buildMessage(otherUserId)],
    });
    const state = buildState(conversation);

    expect(selectOtherParticipantHasNotReplied(currentUserId)(state)).toBe(
      false
    );
  });
});
