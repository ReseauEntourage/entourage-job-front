import { api } from '@/src/store/api/api.slice';
import {
  FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY,
  FETCH_PROFILES_FIXED_CACHE_KEY,
  FETCH_SELECTED_PROFILE_FIXED_CACHE_KEY,
  profilesApi,
} from './profiles.api';
import { RootState as ProfilesSliceRootState } from './profiles.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `profilesApi.endpoints.*.select()` calls below) — same reasoning as
// `store.ts`/`createTestStore.ts`.
type RootState = ProfilesSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

export const fetchProfilesSelectors = {
  selectIsFetchProfilesIdle: (state: RootState) =>
    profilesApi.endpoints.fetchProfiles.select(FETCH_PROFILES_FIXED_CACHE_KEY)(
      state
    ).isUninitialized,
  selectIsFetchProfilesRequested: (state: RootState) =>
    profilesApi.endpoints.fetchProfiles.select(FETCH_PROFILES_FIXED_CACHE_KEY)(
      state
    ).isLoading,
  selectIsFetchProfilesFailed: (state: RootState) =>
    profilesApi.endpoints.fetchProfiles.select(FETCH_PROFILES_FIXED_CACHE_KEY)(
      state
    ).isError,
};

export const fetchDashboardProfilesRecommendationsSelectors = {
  selectIsFetchDashboardProfilesRecommendationsIdle: (state: RootState) =>
    profilesApi.endpoints.fetchDashboardProfilesRecommendations.select(
      FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY
    )(state).isUninitialized,
  selectIsFetchDashboardProfilesRecommendationsRequested: (state: RootState) =>
    profilesApi.endpoints.fetchDashboardProfilesRecommendations.select(
      FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY
    )(state).isLoading,
  selectIsFetchDashboardProfilesRecommendationsFailed: (state: RootState) =>
    profilesApi.endpoints.fetchDashboardProfilesRecommendations.select(
      FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY
    )(state).isError,
};

export const fetchSelectedProfileSelectors = {
  selectIsFetchSelectedProfileRequested: (state: RootState) =>
    profilesApi.endpoints.fetchSelectedProfile.select(
      FETCH_SELECTED_PROFILE_FIXED_CACHE_KEY
    )(state).isLoading,
  selectIsFetchSelectedProfileFailed: (state: RootState) =>
    profilesApi.endpoints.fetchSelectedProfile.select(
      FETCH_SELECTED_PROFILE_FIXED_CACHE_KEY
    )(state).isError,
};

export function selectProfiles(state: RootState) {
  return state.profiles.profiles;
}

export function selectProfilesRecommendations(state: RootState) {
  return state.profiles.profilesRecommendations;
}

export function selectProfilesOffset(state: RootState) {
  return state.profiles.profilesOffset;
}

export function selectProfilesHasFetchedAll(state: RootState) {
  return state.profiles.profilesHasFetchedAll;
}

export function selectSelectedProfile(state: RootState) {
  return state.profiles.selectedProfile;
}

export function selectIsEmbeddingPending(state: RootState) {
  return state.profiles.isEmbeddingPending;
}
