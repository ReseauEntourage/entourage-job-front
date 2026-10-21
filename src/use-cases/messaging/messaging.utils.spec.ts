// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ConversationType } from '@/src/api/types';
import {
  buildNewConversationStub,
  encodeMessageCursor,
  MESSAGES_PAGE_SIZE,
  NEW_CONVERSATION_ID,
} from './messaging.utils';

describe('messaging utils', () => {
  it('exposes the page size and the new conversation sentinel', () => {
    expect(MESSAGES_PAGE_SIZE).toBe(30);
    expect(NEW_CONVERSATION_ID).toBe('new');
  });

  describe('buildNewConversationStub', () => {
    it('builds an empty direct conversation for a single addressee', () => {
      const participants = [{ id: 'p1' }] as any;
      const stub = buildNewConversationStub(participants);
      expect(stub).toMatchObject({
        id: '',
        type: ConversationType.DIRECT,
        messages: [],
        participants,
      });
      expect(new Date(stub.createdAt as string).getTime()).not.toBeNaN();
    });

    it('builds a group conversation for several addressees', () => {
      const stub = buildNewConversationStub([{ id: 'a' }, { id: 'b' }] as any);
      expect(stub.type).toBe(ConversationType.GROUP);
    });
  });

  describe('encodeMessageCursor', () => {
    const decode = (cursor: string) =>
      Buffer.from(cursor, 'base64url').toString('utf8');

    it('encodes the ISO creation date and the id as base64url', () => {
      const cursor = encodeMessageCursor({
        id: 'msg-1',
        createdAt: '2026-01-02T03:04:05.678Z',
      });
      expect(decode(cursor)).toBe('2026-01-02T03:04:05.678Z_msg-1');
      expect(cursor).not.toMatch(/[+/=]/);
    });

    it('normalises the date to ISO format', () => {
      const cursor = encodeMessageCursor({
        id: 'x',
        createdAt: '2026-01-02T03:04:05Z',
      });
      expect(decode(cursor)).toBe('2026-01-02T03:04:05.000Z_x');
    });

    it('is URL safe for ids producing + or / in plain base64', () => {
      const cursor = encodeMessageCursor({
        id: '???>>>',
        createdAt: '2026-01-02T03:04:05.000Z',
      });
      expect(cursor).not.toMatch(/[+/=]/);
      expect(decode(cursor)).toContain('???>>>');
    });
  });
});
