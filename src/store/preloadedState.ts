import { STORAGE_KEYS } from '@/src/constants';
import { slice as authenticationSlice } from '@/src/use-cases/authentication/authentication.slice';

/**
 * Hydrates the `authentication` slice's access token from `localStorage` at
 * store-creation time, replacing `authentication.saga.ts`'s `initSaga`
 * bootstrap (see design.md Decision 4). Guarded for Next.js SSR, where
 * `localStorage` doesn't exist.
 */
export function getPreloadedState() {
  const accessToken =
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null
      : null;

  return {
    authentication: {
      ...authenticationSlice.getInitialState(),
      accessToken,
    },
  };
}
