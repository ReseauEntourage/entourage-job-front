import { createSlice } from '@reduxjs/toolkit';
import { CV } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { fetchCVAdapter } from './cv.adapter';

export interface State {
  fetchCV: RequestState<typeof fetchCVAdapter>;
  currentCv: CV | null;
}

const initialState: State = {
  fetchCV: fetchCVAdapter.getInitialState(),
  currentCv: null,
};

export const slice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    ...fetchCVAdapter.getReducers<State>((state) => state.fetchCV, {
      fetchCVSucceeded(state, action) {
        state.currentCv = action.payload;
      },
    }),
  },
});

export type RootState = SliceRootState<typeof slice>;
