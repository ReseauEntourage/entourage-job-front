/**
 * @jest-environment node
 */
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { encodeMessageCursor } from './messaging.utils';

describe('encodeMessageCursor on the server', () => {
  it('uses Buffer when there is no window', () => {
    expect(typeof window).toBe('undefined');
    const cursor = encodeMessageCursor({
      id: 'msg-1',
      createdAt: '2026-01-02T03:04:05.678Z',
    });
    expect(Buffer.from(cursor, 'base64url').toString('utf8')).toBe(
      '2026-01-02T03:04:05.678Z_msg-1'
    );
  });
});
