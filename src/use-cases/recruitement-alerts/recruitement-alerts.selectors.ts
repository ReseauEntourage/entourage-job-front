import { api } from '@/src/store/api/api.slice';
import {
  FETCH_RECRUITEMENT_ALERTS_FIXED_CACHE_KEY,
  recruitementAlertsApi,
} from './recruitement-alerts.api';
import { RootState as RecruitementAlertsSliceRootState } from './recruitement-alerts.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `recruitementAlertsApi.endpoints.*.select()` calls below) — same reasoning
// as `store.ts`/`createTestStore.ts`.
type RootState = RecruitementAlertsSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

export const selectRecruitementAlerts = (state: RootState) =>
  state.recruitementAlerts.recruitementAlerts;

export const selectFetchRecruitementAlertsLoading = (state: RootState) =>
  recruitementAlertsApi.endpoints.fetchRecruitementAlerts.select(
    FETCH_RECRUITEMENT_ALERTS_FIXED_CACHE_KEY
  )(state).isLoading;

// Using createSelector-free reads: RTK Query's own `.select()` result is
// already referentially stable per state, matching the previous
// `createSelector`-memoized behavior closely enough for these read-only
// selectors.
export const selectRecruitementAlertMatchingById =
  (alertId: string) => (state: RootState) => {
    const result =
      recruitementAlertsApi.endpoints.fetchRecruitementAlertMatching.select(
        alertId
      )(state);
    return {
      profiles: result.data ?? [],
      timestamp: result.fulfilledTimeStamp ?? 0,
    };
  };

export const selectFetchRecruitementAlertMatchingLoading =
  (alertId: string) => (state: RootState) =>
    recruitementAlertsApi.endpoints.fetchRecruitementAlertMatching.select(
      alertId
    )(state).isLoading;
