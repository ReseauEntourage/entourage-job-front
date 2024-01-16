import {
  fetchSelectedProfileAdapter,
  fetchProfilesListAdapter,
} from './profiles.adapters';
import { RootState } from './profiles.slice';

export const fetchProfilesListSelectors =
  fetchProfilesListAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchProfilesList
  );

export const fetchSelectedProfileSelectors =
  fetchSelectedProfileAdapter.getSelectors<RootState>(
    (state) => state.profiles.fetchSelectedProfile
  );

export function selectProfiles(state: RootState) {
  return state.profiles.profilesList;
}

export function selectSelectedProfile(state: RootState) {
  return state.profiles.selectedProfile;
}
