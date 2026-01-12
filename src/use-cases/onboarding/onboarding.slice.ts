import { createSlice } from '@reduxjs/toolkit';
import { SliceRootState } from 'src/store/utils';

export interface State {
  currentOnboardingIdx: number;
}

const initialState: State = {
  currentOnboardingIdx: 0,
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentOnboardingIdx(state, action) {
      state.currentOnboardingIdx = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
