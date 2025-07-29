import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestState, SliceRootState } from 'src/store/utils';
import { fetchProfileCompletionAdapter } from './profile-completion.adapters';

export interface State {
  fetchProfileCompletion: RequestState<typeof fetchProfileCompletionAdapter>;
  completionRate: number;
}

const initialState: State = {
  fetchProfileCompletion: fetchProfileCompletionAdapter.getInitialState(),
  completionRate: 0,
};

export const slice = createSlice({
  name: 'profileCompletion',
  initialState,
  reducers: {
    ...fetchProfileCompletionAdapter.getReducers<State>(
      (state) => state.fetchProfileCompletion,
      {
        fetchProfileCompletionSucceeded(state, action: PayloadAction<number>) {
          state.completionRate = action.payload;
        },
        fetchProfileCompletionFailed(_state) {
          // En cas d'échec, on ne modifie pas le taux de complétion
        },
      }
    ),
  },
});

export type RootState = SliceRootState<typeof slice>;
