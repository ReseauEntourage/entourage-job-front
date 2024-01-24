import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PublicProfile } from 'src/api/types';
import { UserRole } from 'src/constants/users';
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
  profilesFilters: { role?: UserRole[]; offset: number; limit: typeof LIMIT };
  profilesHasFetchedAll: boolean;
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  fetchProfiles: fetchProfilesAdapter.getInitialState(),
  fetchSelectedProfile: fetchSelectedProfileAdapter.getInitialState(),
  postInternalMessage: fetchProfilesAdapter.getInitialState(),
  profiles: [],
  profilesFilters: { offset: 0, limit: LIMIT },
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
