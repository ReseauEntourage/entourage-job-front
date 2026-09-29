import { RootState } from './onboarding.slice';

export const selectWebinarSfId = (state: RootState) =>
  state.onboarding.webinarSfId;

export const selectFormErrorMessage = (state: RootState) =>
  state.onboarding.formErrorMessage;

export const selectAbandonedPresentationGenerationId = (state: RootState) =>
  state.onboarding.abandonedPresentationGenerationId;
