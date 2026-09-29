import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceRootState } from '@/src/store/utils';

interface State {
  webinarSfId: string | null;
  formErrorMessage: string | null;
  // requestId of an AI presentation generation the user chose not to wait for
  // (or left): its result must never be inserted.
  abandonedPresentationGenerationId: string | null;
}

const initialState: State = {
  webinarSfId: null,
  formErrorMessage: null,
  abandonedPresentationGenerationId: null,
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
    presentationGenerationAbandoned(state, action: PayloadAction<string>) {
      state.abandonedPresentationGenerationId = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
