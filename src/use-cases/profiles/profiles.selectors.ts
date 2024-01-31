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

export function selectProfilesIsResetFilters(state: RootState) {
  return state.profiles.profilesIsResetFilters;
}

export function selectProfilesFilters(state: RootState) {
  return state.profiles.profilesFilters;
}

export function selectProfilesSearchFilter(state: RootState) {
  return state.profiles.profilesFilters.search;
}

export function selectProfilesRoleFilter(state: RootState) {
  return state.profiles.profilesFilters.role;
}

export function selectProfilesHelpsFilters(state: RootState) {
  return state.profiles.profilesFilters.helps;
}

export function selectProfilesDepartmentsFilters(state: RootState) {
  return state.profiles.profilesFilters.departments;
}

export function selectProfilesBusinessLinesFilters(state: RootState) {
  return state.profiles.profilesFilters.businessLines;
}

export function selectProfilesHasFetchedAll(state: RootState) {
  return state.profiles.profilesHasFetchedAll;
}

export function selectSelectedProfile(state: RootState) {
  return state.profiles.selectedProfile;
}
