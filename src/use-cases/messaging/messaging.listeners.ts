import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { messagingApi, POST_MESSAGE_FIXED_CACHE_KEY } from './messaging.api';
import { slice } from './messaging.slice';

const { actions } = slice;

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
    if (selectedConversationId) {
      listenerApi.dispatch(
        messagingApi.endpoints.getSelectedConversation.initiate(
          selectedConversationId,
          { forceRefetch: true }
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
