import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { messagingApi, POST_MESSAGE_FIXED_CACHE_KEY } from './messaging.api';
import { slice } from './messaging.slice';
import { NEW_CONVERSATION_ID } from './messaging.utils';

const { actions } = slice;

/**
 * Every `initiate()` below is non-subscribing: these listeners force a
 * refresh, which is not a reason to keep an entry alive. They used to open a
 * subscription that was never released — one per trigger, and the messaging
 * screen triggers a conversations refresh every 30 seconds, so a session
 * accumulated dead subscriptions for as long as it stayed open.
 *
 * Cache lifetime belongs to the components that display the data:
 * `MessagingConversationList` and `MessagingConversation` for the
 * conversations, `NavConnected` (mounted on every backoffice page) for the
 * unread count, `MessagingConversation` for the selected conversation. Do
 * not re-add `subscribe: true` here — give the consumer a query hook
 * instead.
 */

/** Translates `getConversationsSagaRequested`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.getConversationsRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      messagingApi.endpoints.getConversations.initiate(undefined, {
        forceRefetch: true,
        subscribe: false,
      })
    );
  },
});

/** Translates `getUnseenConversationsCountSagaRequested`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.getUnseenConversationsCountRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      messagingApi.endpoints.getUnseenConversationsCount.initiate(undefined, {
        forceRefetch: true,
        subscribe: false,
      })
    );
  },
});

/** Translates `getSelectedConversationSagaRequested`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.getSelectedConversationRequested,
  effect: (_action, listenerApi) => {
    const { selectedConversationId } = (
      listenerApi.getState() as never as {
        messaging: { selectedConversationId: string | null };
      }
    ).messaging;
    if (
      selectedConversationId &&
      selectedConversationId !== NEW_CONVERSATION_ID
    ) {
      // `subscribe: false`: this is a forced refresh, not a reason to keep
      // the entry alive. It used to open a subscription that was never
      // released, which kept every visited conversation cached forever —
      // masking the fact that no component actually subscribed. The cache
      // entry's lifetime now belongs to `MessagingConversation`'s
      // `useGetSelectedConversationQuery`, tied to its mount.
      listenerApi.dispatch(
        messagingApi.endpoints.getSelectedConversation.initiate(
          selectedConversationId,
          { forceRefetch: true, subscribe: false }
        )
      );
    }
  },
});

/**
 * Explicit read receipt, triggered on initial load. (The delta-poll and
 * load-older-messages flows are called directly from
 * `MessagingConversation` via their mutation hooks instead of this
 * trigger-action pattern: unlike a plain fire-and-forget request, they
 * need their result back locally — respectively to compute the next
 * poll's cursor from already-selected state, and to know whether the
 * returned page was full, to decide if there's more history to load.)
 */
listenerMiddleware.startListening({
  actionCreator: actions.markConversationSeenRequested,
  effect: (_action, listenerApi) => {
    const { selectedConversationId } = (
      listenerApi.getState() as never as {
        messaging: { selectedConversationId: string | null };
      }
    ).messaging;
    if (selectedConversationId && selectedConversationId !== 'new') {
      listenerApi.dispatch(
        messagingApi.endpoints.markConversationSeen.initiate(
          selectedConversationId
        )
      );
    }
  },
});

/** Translates `postMessageSagaRequested`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.postMessageRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      messagingApi.endpoints.postMessage.initiate(action.payload, {
        fixedCacheKey: POST_MESSAGE_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `bindNewConversationSagaRequested`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.bindNewConversationRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      messagingApi.endpoints.bindNewConversation.initiate(action.payload)
    );
  },
});
