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

export function selectProfilesFilters(state: RootState) {
  const { role, search, ...restFilters } = state.profiles.profilesFilters;
  return restFilters;
}

export function selectProfilesSearchFilter(state: RootState) {
  return state.profiles.profilesFilters.search;
}

export function selectProfilesRoleFilter(state: RootState) {
  return state.profiles.profilesFilters.role;
}

export function selectProfilesHasFetchedAll(state: RootState) {
  return state.profiles.profilesHasFetchedAll;
}

export function selectSelectedProfile(state: RootState) {
  return state.profiles.selectedProfile;
}
