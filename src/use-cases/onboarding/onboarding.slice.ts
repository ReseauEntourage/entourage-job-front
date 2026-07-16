import { createSlice } from '@reduxjs/toolkit';
import { SliceRootState } from 'src/store/utils';

interface State {
  webinarSfId: string | null;
  formErrorMessage: string | null;
}

const initialState: State = {
  webinarSfId: null,
  formErrorMessage: null,
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setWebinarSfId(state, action) {
      state.webinarSfId = action.payload;
    },
    setFormErrorMessage(state, action) {
      state.formErrorMessage = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
