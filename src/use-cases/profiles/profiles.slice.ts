import { createSlice } from '@reduxjs/toolkit';
import { PublicProfile } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchSelectedProfileAdapter,
  fetchProfilesListAdapter,
} from './profiles.adapters';

export interface State {
  fetchProfilesList: RequestState<typeof fetchProfilesListAdapter>;
  fetchSelectedProfile: RequestState<typeof fetchSelectedProfileAdapter>;
  profilesList: PublicProfile[] | null;
  selectedProfile: PublicProfile | null;
}

const initialState: State = {
  fetchProfilesList: fetchProfilesListAdapter.getInitialState(),
  fetchSelectedProfile: fetchSelectedProfileAdapter.getInitialState(),
  profilesList: null,
  selectedProfile: null,
};

export const slice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    ...fetchProfilesListAdapter.getReducers<State>(
      (state) => state.fetchProfilesList,
      {
        fetchProfilesListSucceeded(state, action) {
          state.profilesList = action.payload;
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
  },
});

export type RootState = SliceRootState<typeof slice>;
