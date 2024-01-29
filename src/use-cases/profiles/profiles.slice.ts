import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HelpNames, PublicProfile } from 'src/api/types';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { CANDIDATE_USER_ROLES, UserRole } from 'src/constants/users';
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
  profilesFilters: {
    role: UserRole[];
    offset: number;
    limit: typeof LIMIT;
    search?: string;
    helps?: HelpNames[];
    departments?: Department[];
    businessLines?: BusinessLineValue[];
  };
  profilesHasFetchedAll: boolean;
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  fetchProfiles: fetchProfilesAdapter.getInitialState(),
  fetchSelectedProfile: fetchSelectedProfileAdapter.getInitialState(),
  postInternalMessage: fetchProfilesAdapter.getInitialState(),
  profiles: [],
  profilesFilters: { role: CANDIDATE_USER_ROLES, offset: 0, limit: LIMIT },
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
          state.profilesFilters.offset === 0
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
    setProfilesRoleFilter(state, action: PayloadAction<UserRole[]>) {
      state.profilesFilters = {
        ...state.profilesFilters,
        role: action.payload,
        offset: 0,
      };
      state.profilesHasFetchedAll = false;
      state.profiles = [];
    },
    setProfilesFilters(
      state,
      action: PayloadAction<{
        search?: string;
        helps?: HelpNames[];
        departments?: Department[];
        businessLines?: BusinessLineValue[];
      }>
    ) {
      state.profilesFilters = {
        ...state.profilesFilters,
        ...action.payload,
        offset: 0,
      };
      state.profilesHasFetchedAll = false;
      state.profiles = [];
    },
    incrementProfilesOffset(state) {
      state.profilesFilters = {
        ...state.profilesFilters,
        offset: state.profilesHasFetchedAll
          ? state.profilesFilters.offset
          : state.profilesFilters.offset + LIMIT,
      };
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
