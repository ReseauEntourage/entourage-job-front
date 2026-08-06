import { STORAGE_KEYS } from '@/src/constants';

/**
 * Seeds `localStorage` with an access token before creating a test store.
 * `createTestStore()` reads it via `getPreloadedState()` (mirroring
 * `store.ts`) to set `authentication.accessToken` at store-creation time —
 * call this before `createTestStore()`, not after. Domains whose sagas/
 * listeners guard on `selectAccessToken` (e.g. `current-user`) need this to
 * simulate being logged in.
 */
export function seedAccessToken(token: string) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}
