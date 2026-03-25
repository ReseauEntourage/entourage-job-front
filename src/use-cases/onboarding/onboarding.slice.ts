import { createSlice } from '@reduxjs/toolkit';
import { SliceRootState } from 'src/store/utils';

export interface State {
  currentOnboardingIdx: number | null;
  webinarSfId: string | null;
  noDateSelected: boolean;
  formErrorMessage: string | null;
  isLoading: boolean;
}

const initialState: State = {
  currentOnboardingIdx: null,
  webinarSfId: null,
  noDateSelected: false,
  formErrorMessage: null,
  isLoading: false,
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setCurrentOnboardingIdx(state, action) {
      state.currentOnboardingIdx = action.payload;
    },
    setWebinarSfId(state, action) {
      state.webinarSfId = action.payload;
    },
    setNoDateSelected(state, action) {
      state.noDateSelected = action.payload;
    },
    setFormErrorMessage(state, action) {
      state.formErrorMessage = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
