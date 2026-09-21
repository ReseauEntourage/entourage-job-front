import {
  Conversation,
  ConversationParticipants,
  ConversationType,
  Message,
} from '@/src/api/types';

/** Mirrors the backend's default page size for `GET conversations/:id`. */
export const MESSAGES_PAGE_SIZE = 30;

/**
 * Sentinel `selectedConversationId` for the "new conversation" screen: a
 * conversation being composed that does not exist server-side yet, and
 * therefore has no real id.
 */
export const NEW_CONVERSATION_ID = 'new';

/**
 * Builds the client-only conversation displayed while composing a first
 * message.
 *
 * Derived on read from `messaging.newConversationDraft` (see
 * `selectSelectedConversation`) rather than stored. It used to be injected
 * into the RTK Query cache under the `'new'` key, where — having no
 * subscriber — it was garbage-collected after `keepUnusedDataFor` (60s by
 * default). Past that delay the addressee vanished from the header and the
 * send button became a silent no-op: anyone taking more than a minute to
 * write their first message simply could not send it.
 */
export function buildNewConversationStub(
  participants: ConversationParticipants
): Conversation {
  return {
    id: '',
    type:
      participants.length > 1
        ? ConversationType.GROUP
        : ConversationType.DIRECT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    participants,
  };
}

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
