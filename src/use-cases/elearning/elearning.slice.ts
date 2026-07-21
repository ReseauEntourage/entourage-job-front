import { createSlice } from '@reduxjs/toolkit';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchElearningUnitsAdapter,
  postElearningCompletionAdapter,
} from './elearning.adapters';

interface State {
  fetchElearningUnits: RequestState<typeof fetchElearningUnitsAdapter>;
  postElearningCompletion: RequestState<typeof postElearningCompletionAdapter>;
  elearningUnits: ElearningUnit[];
  isLoading: boolean;
}

const initialState: State = {
  fetchElearningUnits: fetchElearningUnitsAdapter.getInitialState(),
  postElearningCompletion: postElearningCompletionAdapter.getInitialState(),
  elearningUnits: [],
  isLoading: false,
};

export const slice = createSlice({
  name: 'elearning',
  initialState,
  reducers: {
    ...fetchElearningUnitsAdapter.getReducers<State>(
      (state) => state.fetchElearningUnits,
      {
        fetchElearningUnitsSucceeded(state, action) {
          state.elearningUnits = action.payload;
        },
      }
    ),
    ...postElearningCompletionAdapter.getReducers<State>(
      (state) => state.postElearningCompletion,
      {
        postElearningCompletionSucceeded(state, action) {
          // Replace (rather than append) so a replay never yields more than
          // one completion per unit in the store
          const updatedCompletion = action.payload;
          const unitIndex = state.elearningUnits.findIndex(
            (unit) => unit.id === updatedCompletion.unitId
          );
          if (unitIndex !== -1) {
            const unit = state.elearningUnits[unitIndex];
            unit.userCompletions = [
              ...unit.userCompletions.filter(
                (completion) => completion.unitId !== updatedCompletion.unitId
              ),
              updatedCompletion,
            ];
            state.elearningUnits[unitIndex] = unit;
          }
        },
      }
    ),
    setIsLoading(state, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
