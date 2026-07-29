import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { slice as authenticationSlice } from '@/src/use-cases/authentication/authentication.slice';
import { slice } from './elearning.slice';

/**
 * Translates `elearning.saga.ts`'s
 * `takeLatest(authenticationActions.logoutSucceeded, logoutSucceededSaga)`.
 * The RTK Query cache itself is cleared app-wide by the central listener in
 * `src/store/listenerMiddleware.ts` (design.md Decision 9) — this only
 * resets `elearning`'s own remaining client-only state.
 */
listenerMiddleware.startListening({
  actionCreator: authenticationSlice.actions.logoutSucceeded,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(slice.actions.resetElearning());
  },
});
