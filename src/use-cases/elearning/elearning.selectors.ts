import { RootState } from './elearning.slice';

export const selectIsLoading = (state: RootState) => state.elearning.isLoading;
