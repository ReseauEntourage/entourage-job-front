import { Message } from '@/src/api/types';

/** Mirrors the backend's default page size for `GET conversations/:id`. */
export const MESSAGES_PAGE_SIZE = 30;

/**
 * Encodes a message's `(createdAt, id)` as the same opaque pagination
 * cursor the backend expects for `before`/`after` — see
 * `messaging.utils.ts` (`encodeMessageCursor`) on the backend. Computed
 * client-side from a message already held in the cache, so the backend
 * never needs to echo cursors back in its response.
 */
export const encodeMessageCursor = (
  message: Pick<Message, 'id' | 'createdAt'>
): string => {
  const raw = `${new Date(message.createdAt).toISOString()}_${message.id}`;
  return typeof window !== 'undefined'
    ? window.btoa(raw)
    : Buffer.from(raw).toString('base64');
};
