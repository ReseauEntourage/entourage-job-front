import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ProfilesFilters,
  PublicProfile,
  ProfileRecommendation,
} from 'src/api/types';
import { PROFILES_LIMIT } from 'src/constants';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchProfilesAdapter,
  fetchDashboardProfilesRecommendationsAdapter,
  fetchSelectedProfileAdapter,
} from './profiles.adapters';

interface State {
  fetchProfiles: RequestState<typeof fetchProfilesAdapter>;
  fetchDashboardProfilesRecommendations: RequestState<
    typeof fetchDashboardProfilesRecommendationsAdapter
  >;
  fetchSelectedProfile: RequestState<typeof fetchSelectedProfileAdapter>;
  profiles: PublicProfile[];
  profilesOffset: number;
  profilesHasFetchedAll: boolean;
  profilesRecommendations: ProfileRecommendation[];
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  fetchProfiles: fetchProfilesAdapter.getInitialState(),
  fetchDashboardProfilesRecommendations:
    fetchDashboardProfilesRecommendationsAdapter.getInitialState(),
  fetchSelectedProfile: fetchSelectedProfileAdapter.getInitialState(),
  profiles: [],
  profilesOffset: 0,
  profilesHasFetchedAll: false,
  profilesRecommendations: [],
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
        state.profilesHasFetchedAll = action.payload.length < PROFILES_LIMIT;
      },
    }),
    ...fetchDashboardProfilesRecommendationsAdapter.getReducers<State>(
      (state) => state.fetchDashboardProfilesRecommendations,
      {
        fetchDashboardProfilesRecommendationsSucceeded(state, action) {
          state.profilesRecommendations = action.payload.recommendations;
        },
        fetchDashboardProfilesRecommendationsReset(state) {
          state.profilesRecommendations = [];
        },
      }
    ),
    ...fetchSelectedProfileAdapter.getReducers<State>(
      (state) => state.fetchSelectedProfile,
      {
        fetchSelectedProfileSucceeded(state, action) {
          state.selectedProfile = action.payload;
        },
      }
    ),
    resetProfilesOffset(state) {
      state.profilesOffset = 0;
      state.profilesHasFetchedAll = false;
      state.profiles = [];
    },
    fetchProfilesWithFilters(
      _state,
      _action: PayloadAction<ProfilesFilters>
    ) {},
    fetchProfilesNextPage(state, _action: PayloadAction<ProfilesFilters>) {
      state.profilesOffset = state.profilesHasFetchedAll
        ? state.profilesOffset
        : state.profilesOffset + PROFILES_LIMIT;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
