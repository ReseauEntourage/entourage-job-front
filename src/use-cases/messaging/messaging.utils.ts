import { Message } from '@/src/api/types';

/** Mirrors the backend's default page size for `GET conversations/:id`. */
export const MESSAGES_PAGE_SIZE = 30;

/**
 * Encodes a message's `(createdAt, id)` as the same opaque pagination
 * cursor the backend expects for `before`/`after` — see
 * `messaging.utils.ts` (`encodeMessageCursor`) on the backend. Computed
 * client-side from a message already held in the cache, so the backend
 * never needs to echo cursors back in its response.
 *
 * Encoded as base64url (not plain base64): the backend decodes with
 * `Buffer.from(cursor, 'base64url')`, and using the URL-safe alphabet
 * here means the result never contains `+`/`/`/`=` — safe to drop into
 * a query string as-is, with no risk of `+` being misread as a space by
 * a caller that doesn't percent-encode it.
 */
export const encodeMessageCursor = (
  message: Pick<Message, 'id' | 'createdAt'>
): string => {
  const raw = `${new Date(message.createdAt).toISOString()}_${message.id}`;
  const base64 =
    typeof window !== 'undefined'
      ? window.btoa(raw)
      : Buffer.from(raw).toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
