import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { messagingApi, POST_MESSAGE_FIXED_CACHE_KEY } from './messaging.api';
import { slice } from './messaging.slice';
import { NEW_CONVERSATION_ID } from './messaging.utils';

const { actions } = slice;

/**
 * ⚠️ The two listeners below deliberately keep their (never-released)
 * subscription, unlike `getSelectedConversationRequested` further down.
 *
 * No component subscribes to `getConversations` or
 * `getUnseenConversationsCount` — both are read through selectors only — so
 * that subscription is the single thing keeping their cache entries alive.
 * Adding `subscribe: false` here without first giving those consumers a
 * real query-hook subscription would make the conversation list and the
 * unread badge silently empty themselves after `keepUnusedDataFor`: exactly
 * the bug that `fix-new-conversation-stub-gc` fixed on the new-conversation
 * screen, moved to another screen.
 *
 * Cleaning this up properly means subscribing from the components that
 * display them, then dropping the subscription here — in that order.
 */

/** Translates `getConversationsSagaRequested`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.getConversationsRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      messagingApi.endpoints.getConversations.initiate(undefined, {
        forceRefetch: true,
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
