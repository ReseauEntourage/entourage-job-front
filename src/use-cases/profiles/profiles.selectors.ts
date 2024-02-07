import {
  fetchProfilesAdapter,
  fetchSelectedProfileAdapter,
  postInternalMessageAdapter,
} from './profiles.adapters';
import { RootState } from './profiles.slice';

export const fetchProfilesSelectors =
  fetchProfilesAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchProfiles
  );

export const fetchSelectedProfileSelectors =
  fetchSelectedProfileAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchSelectedProfile
  );

export const postInternalMessageSelectors =
  postInternalMessageAdapter.getSelectors<RootState>(
    (state) => state.profiles.postInternalMessage
  );

export function selectProfiles(state: RootState) {
  return state.profiles.profiles;
}

export function selectProfilesOffset(state: RootState) {
  return state.profiles.profilesOffset;
}

export function selectProfilesLimit(state: RootState) {
  return state.profiles.profilesLimit;
}

export function selectProfilesHasFetchedAll(state: RootState) {
  return state.profiles.profilesHasFetchedAll;
}

export function selectSelectedProfile(state: RootState) {
  return state.profiles.selectedProfile;
}
