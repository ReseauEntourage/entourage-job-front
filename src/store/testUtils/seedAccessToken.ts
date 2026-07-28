import { STORAGE_KEYS } from '@/src/constants';

/**
 * Seeds `localStorage` with an access token before creating a test store.
 * `authentication`'s saga reads the token from `localStorage` via a
 * `fork(initSaga)` at startup (not from preloaded state) and dispatches
 * `setAccessToken`, overwriting any `authentication.accessToken` passed as
 * preloaded state. Domains whose sagas guard on `selectAccessToken` (e.g.
 * `current-user`) need this instead of preloaded state to simulate being
 * logged in.
 */
export function seedAccessToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}
