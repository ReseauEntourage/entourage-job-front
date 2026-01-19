import { RootState } from './elearning.slice';

export const selectIsLoading = (state: RootState) => state.elearning.isLoading;

export const selectElearningUnits = (state: RootState) =>
  state.elearning.elearningUnits;

export const selectFetchElearningUnitsState = (state: RootState) =>
  state.elearning.fetchElearningUnits;
