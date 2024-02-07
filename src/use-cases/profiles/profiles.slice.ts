/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfilesFilters, PublicProfile } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchProfilesAdapter,
  fetchSelectedProfileAdapter,
  postInternalMessageAdapter,
} from './profiles.adapters';

const LIMIT = 25;

export interface State {
  fetchProfiles: RequestState<typeof fetchProfilesAdapter>;
  fetchSelectedProfile: RequestState<typeof fetchSelectedProfileAdapter>;
  postInternalMessage: RequestState<typeof postInternalMessageAdapter>;
  profiles: PublicProfile[];
  profilesOffset: number;
  profilesLimit: typeof LIMIT;
  profilesHasFetchedAll: boolean;
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  fetchProfiles: fetchProfilesAdapter.getInitialState(),
  fetchSelectedProfile: fetchSelectedProfileAdapter.getInitialState(),
  postInternalMessage: fetchProfilesAdapter.getInitialState(),
  profiles: [],
  profilesOffset: 0,
  profilesLimit: LIMIT,
  profilesHasFetchedAll: false,
  selectedProfile: null,
};

export const slice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    ...fetchProfilesAdapter.getReducers<State>((state) => state.fetchProfiles, {
      fetchProfilesSucceeded(state, action) {
        state.profiles =
          state.profilesOffset === 0
            ? action.payload
            : [...state.profiles, ...action.payload];
        state.profilesHasFetchedAll = action.payload.length < LIMIT;
      },
    }),
    ...fetchSelectedProfileAdapter.getReducers<State>(
      (state) => state.fetchSelectedProfile,
      {
        fetchSelectedProfileSucceeded(state, action) {
          state.selectedProfile = action.payload;
        },
      }
    ),
    ...postInternalMessageAdapter.getReducers<State>(
      (state) => state.postInternalMessage,
      {}
    ),
    resetProfilesOffset(state) {
      state.profilesOffset = 0;
      state.profilesHasFetchedAll = false;
      state.profiles = [];
    },
    fetchProfilesWithFilters(state, action: PayloadAction<ProfilesFilters>) {},
    fetchProfilesNextPage(state, action: PayloadAction<ProfilesFilters>) {
      state.profilesOffset = state.profilesHasFetchedAll
        ? state.profilesOffset
        : state.profilesOffset + LIMIT;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
