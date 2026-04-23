import { RootState } from './onboarding.slice';

export const selectCurrentOnboardingIdx = (state: RootState) =>
  state.onboarding.currentOnboardingIdx;

export const selectWebinarSfId = (state: RootState) =>
  state.onboarding.webinarSfId;

export const selectNoDateSelected = (state: RootState) =>
  state.onboarding.noDateSelected;

export const selectFormErrorMessage = (state: RootState) =>
  state.onboarding.formErrorMessage;

export const selectIsLoading = (state: RootState) => state.onboarding.isLoading;
