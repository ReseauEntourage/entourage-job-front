import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PublicProfile } from 'src/api/types';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { HelpNames } from 'src/constants/helps';
import { CANDIDATE_USER_ROLES, UserRole } from 'src/constants/users';
import { RequestState, SliceRootState } from 'src/store/utils';
import { mutateToArray } from 'src/utils';
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
    search: string | null;
    helps: HelpNames[];
    departments: Department[];
    businessLines: BusinessLineValue[];
  };
  profilesHasFetchedAll: boolean;
  profilesIsResetFilters: boolean;
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  fetchProfiles: fetchProfilesAdapter.getInitialState(),
  fetchSelectedProfile: fetchSelectedProfileAdapter.getInitialState(),
  postInternalMessage: fetchProfilesAdapter.getInitialState(),
  profiles: [],
  profilesFilters: {
    role: CANDIDATE_USER_ROLES,
    offset: 0,
    limit: LIMIT,
    search: null,
    helps: [],
    departments: [],
    businessLines: [],
  },
  profilesHasFetchedAll: false,
  profilesIsResetFilters: false,
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
        state.profilesIsResetFilters = false;
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
    setProfilesFilters(
      state,
      action: PayloadAction<{
        role: UserRole[];
        search: string | null;
        helps: HelpNames | HelpNames[];
        departments: Department | Department[];
        businessLines: BusinessLineValue | BusinessLineValue[];
      }>
    ) {
      state.profilesFilters = {
        ...state.profilesFilters,
        ...action.payload,
        departments: mutateToArray(action.payload.departments),
        businessLines: mutateToArray(action.payload.businessLines),
        helps: mutateToArray(action.payload.helps),
      };
    },
    setProfilesHelpsFilter(
      state,
      action: PayloadAction<HelpNames | HelpNames[]>
    ) {
      state.profilesFilters = {
        ...state.profilesFilters,
        helps: mutateToArray(action.payload),
      };
    },
    setProfilesBusinessLinesFilter(
      state,
      action: PayloadAction<BusinessLineValue | BusinessLineValue[]>
    ) {
      state.profilesFilters = {
        ...state.profilesFilters,
        businessLines: mutateToArray(action.payload),
      };
    },
    setProfilesDepartmentsFilter(
      state,
      action: PayloadAction<Department | Department[]>
    ) {
      state.profilesFilters = {
        ...state.profilesFilters,
        departments: mutateToArray(action.payload),
      };
    },
    setProfilesRoleFilter(state, action: PayloadAction<UserRole[]>) {
      state.profilesFilters = {
        ...state.profilesFilters,
        role: action.payload,
      };
    },
    setProfilesSearchFilter(state, action: PayloadAction<string | null>) {
      state.profilesFilters = {
        ...state.profilesFilters,
        search: action.payload,
      };
    },
    resetProfilesOffset(state) {
      state.profilesFilters = {
        ...state.profilesFilters,
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
    resetProfilesFilters(state) {
      state.profilesIsResetFilters = true;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
