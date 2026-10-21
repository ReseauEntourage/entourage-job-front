// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  Conversation,
  Message,
  MessageType,
  ServiceMessageKind,
} from '@/src/api/types';
import {
  conversationHasUnreadMessages,
  getCheckinNoteMessage,
  getLastUserMessage,
} from './messaging.utils';

const buildMessage = (overrides: Partial<Message>): Message =>
  ({
    id: 'm',
    content: 'Hello',
    authorId: 'other',
    createdAt: '2026-10-02T10:00:00.000Z',
    type: MessageType.USER,
    ...overrides,
  }) as Message;

const buildConversation = (
  overrides: Partial<Conversation> = {}
): Conversation =>
  ({
    id: 'c',
    messages: [],
    seenAt: undefined,
    participants: [
      { id: 'me', userProfile: {} },
      { id: 'other', userProfile: {} },
    ],
    ...overrides,
  }) as unknown as Conversation;

describe('conversationHasUnreadMessages', () => {
  it('is false without message from the other participant', () => {
    expect(
      conversationHasUnreadMessages(
        buildConversation({
          messages: [buildMessage({ authorId: 'me' })],
        }),
        'me'
      )
    ).toBe(false);
  });

  it('ignores service messages', () => {
    expect(
      conversationHasUnreadMessages(
        buildConversation({
          messages: [buildMessage({ type: MessageType.SERVICE })],
        }),
        'me'
      )
    ).toBe(false);
  });

  it('is true when the conversation was never seen', () => {
    expect(
      conversationHasUnreadMessages(
        buildConversation({ messages: [buildMessage({})] }),
        'me'
      )
    ).toBe(true);
  });

  it('compares the last foreign message with the last seen date', () => {
    const messages = [buildMessage({ createdAt: '2026-10-02T10:00:00.000Z' })];
    expect(
      conversationHasUnreadMessages(
        buildConversation({ messages, seenAt: '2026-10-01T10:00:00.000Z' }),
        'me'
      )
    ).toBe(true);
    expect(
      conversationHasUnreadMessages(
        buildConversation({ messages, seenAt: '2026-10-03T10:00:00.000Z' }),
        'me'
      )
    ).toBe(false);
  });

  it('is false when every other participant deleted their account', () => {
    expect(
      conversationHasUnreadMessages(
        buildConversation({
          messages: [buildMessage({})],
          participants: [
            { id: 'me', userProfile: {} },
            { id: 'other', userProfile: null },
          ] as any,
        }),
        'me'
      )
    ).toBe(false);
  });
});

describe('getLastUserMessage', () => {
  it('skips service messages, keeping the newest-first order', () => {
    const user = buildMessage({ id: 'user' });
    expect(
      getLastUserMessage([
        buildMessage({ id: 'svc', type: MessageType.SERVICE }),
        user,
        buildMessage({ id: 'older' }),
      ])
    ).toBe(user);
  });

  it('returns undefined when there is only service messages', () => {
    expect(
      getLastUserMessage([buildMessage({ type: MessageType.SERVICE })])
    ).toBeUndefined();
    expect(getLastUserMessage([])).toBeUndefined();
  });
});

describe('getCheckinNoteMessage', () => {
  it('finds the checkin note among the messages', () => {
    const note = buildMessage({
      type: MessageType.SERVICE,
      serviceMessageKind: ServiceMessageKind.CHECKIN_NOTE,
    });
    expect(getCheckinNoteMessage([buildMessage({}), note])).toBe(note);
  });

  it('returns undefined without note', () => {
    expect(getCheckinNoteMessage([buildMessage({})])).toBeUndefined();
  });
});
