import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ProfilesFilters,
  PublicProfile,
  ProfileRecommendation,
  ProfileRecommendationPage,
} from '@/src/api/types';
import { PROFILES_LIMIT } from '@/src/constants';
import { SliceRootState } from '@/src/store/utils';

interface State {
  profiles: PublicProfile[];
  profilesOffset: number;
  profilesHasFetchedAll: boolean;
  profilesRecommendations: ProfileRecommendation[];
  isEmbeddingPending: boolean;
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  profiles: [],
  profilesOffset: 0,
  profilesHasFetchedAll: false,
  profilesRecommendations: [],
  isEmbeddingPending: false,
  selectedProfile: null,
};

export const slice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    fetchProfilesSucceeded(state, action: PayloadAction<PublicProfile[]>) {
      state.profiles =
        state.profilesOffset === 0
          ? action.payload
          : [...state.profiles, ...action.payload];
      state.profilesHasFetchedAll = action.payload.length < PROFILES_LIMIT;
    },
    fetchDashboardProfilesRecommendationsSucceeded(
      state,
      action: PayloadAction<ProfileRecommendationPage>
    ) {
      state.profilesRecommendations = action.payload.recommendations;
      state.isEmbeddingPending = action.payload.embeddingPending;
    },
    fetchDashboardProfilesRecommendationsReset(state) {
      state.profilesRecommendations = [];
      state.isEmbeddingPending = false;
    },
    fetchSelectedProfileSucceeded(state, action: PayloadAction<PublicProfile>) {
      state.selectedProfile = action.payload;
    },
    embeddingPendingChanged(state, action: PayloadAction<boolean>) {
      state.isEmbeddingPending = action.payload;
    },
    resetProfilesOffset(state) {
      state.profilesOffset = 0;
      state.profilesHasFetchedAll = false;
      state.profiles = [];
    },
    // No-op trigger actions: real handling lives in `profiles.api.ts`,
    // dispatched via `profiles.listeners.ts` in reaction to these.
    fetchProfilesWithFilters(
      _state,
      _action: PayloadAction<ProfilesFilters>
    ) {},
    fetchProfilesRequested(_state, _action: PayloadAction<ProfilesFilters>) {},
    fetchDashboardProfilesRecommendationsRequested() {},
    fetchSelectedProfileRequested(
      _state,
      _action: PayloadAction<{ userId: string }>
    ) {},
    // No-op trigger: the guard (hasFetchedAll / last fetch succeeded) and
    // the offset increment both moved to `profiles.listeners.ts`, since the
    // guard now needs the `fetchProfiles` mutation's own state.
    fetchProfilesNextPage(_state, _action: PayloadAction<ProfilesFilters>) {},
    incrementProfilesOffset(state) {
      state.profilesOffset += PROFILES_LIMIT;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
