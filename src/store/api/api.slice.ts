import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Single shared RTK Query instance for the whole app. Every use-case domain
 * adds its endpoints via `api.injectEndpoints({...})` in its own file rather
 * than creating a separate `createApi()` instance (see design.md Decision 1).
 *
 * `fakeBaseQuery` is used because every endpoint calls the existing `Api`
 * instance (`src/api/api.ts`) directly from its own `queryFn`/`mutationFn`,
 * preserving its axios auth/interceptor behavior instead of reimplementing
 * it as a generic RTK Query `baseQuery` (see design.md Decision 2).
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: () => ({}),
});
