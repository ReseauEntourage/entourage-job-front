import {
  fetchProfilesAdapter,
  fetchProfilesRecommendationsAdapter,
  fetchSelectedProfileAdapter,
} from './profiles.adapters';
import { RootState } from './profiles.slice';

export const fetchProfilesSelectors =
  fetchProfilesAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchProfiles
  );

export const fetchProfilesRecommendationsSelectors =
  fetchProfilesRecommendationsAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchProfilesRecommendations
  );

export const fetchSelectedProfileSelectors =
  fetchSelectedProfileAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchSelectedProfile
  );

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
