import { createSlice } from '@reduxjs/toolkit';
import { RequestState, SliceRootState } from 'src/store/utils';
import { generateProfileFromCVAdapter } from './cv.adapter';

export interface State {
  generateProfileFromCV: RequestState<typeof generateProfileFromCVAdapter>;
}

const initialState: State = {
  generateProfileFromCV: generateProfileFromCVAdapter.getInitialState(),
};

export const slice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    ...generateProfileFromCVAdapter.getReducers<State>(
      (state) => state.generateProfileFromCV
    ),
  },
});

export type RootState = SliceRootState<typeof slice>;
