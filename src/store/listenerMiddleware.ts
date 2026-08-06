import { createListenerMiddleware } from '@reduxjs/toolkit';
import { slice as authenticationSlice } from '@/src/use-cases/authentication/authentication.slice';
import { api } from './api/api.slice';

/**
 * Single shared listener middleware for the whole app, mirroring the shared
 * `api` instance (`src/store/api/api.slice.ts`). Domains that need to react
 * to another domain's *action* (not its state) call
 * `listenerMiddleware.startListening({...})` in their own file — additive,
 * like `injectEndpoints` — rather than each domain running its own
 * middleware instance. See design.md Decision 8.
 */
export const listenerMiddleware = createListenerMiddleware();

/**
 * Clears every domain's RTK Query cache on logout — registered centrally
 * (not per-domain) because most migrated domains fetch data implicitly
 * scoped to "the current authenticated user" (via the auth token, not an
 * explicit user id in the query argument), so a stale cache entry could
 * otherwise leak across a logout/login as a different user. This is RTK
 * Query's documented pattern for auth transitions. See design.md Decision 9
 * (discovered during `elearning`'s migration; supersedes the need for each
 * domain to reset its own cache on logout individually).
 */
listenerMiddleware.startListening({
  actionCreator: authenticationSlice.actions.logoutSucceeded,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(api.util.resetApiState());
  },
});
