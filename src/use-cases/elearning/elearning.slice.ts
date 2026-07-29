import { createSlice } from '@reduxjs/toolkit';
import { SliceRootState } from '@/src/store/utils';

interface State {
  isLoading: boolean;
}

const initialState: State = {
  isLoading: false,
};

export const slice = createSlice({
  name: 'elearning',
  initialState,
  reducers: {
    setIsLoading(state, action: { payload: boolean }) {
      state.isLoading = action.payload;
    },
    resetElearning() {
      return initialState;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
