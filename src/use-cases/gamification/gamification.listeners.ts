import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { messagingApi } from '@/src/use-cases/messaging/messaging.api';
import { gamificationApi } from './gamification.api';

/**
 * Translates `gamification.saga.ts`'s
 * `takeEvery(messagingSlice.actions.postMessageSucceeded, ...)`: reacts to
 * messaging's action (not its state) to refetch achievement progressions.
 * Originally matched the plain `postMessageSucceeded` action; now that
 * `messaging` has itself migrated (its mutation success is no longer
 * broadcast as a plain action — see its own `postMessage` endpoint), this
 * matches the RTK Query mutation's own fulfilled action instead. See
 * design.md Decision 8.
 */
listenerMiddleware.startListening({
  matcher: messagingApi.endpoints.postMessage.matchFulfilled,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      gamificationApi.endpoints.refetchAchievementProgressionAfterMessage.initiate(
        undefined,
        { forceRefetch: true }
      )
    );
  },
});
