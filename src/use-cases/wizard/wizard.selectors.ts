import { RootState } from './wizard.slice';

export const selectWizardCurrentSubStep = (state: RootState) =>
  state.wizard.currentSubStep;

export const selectWizardCurrentMajorStep = (state: RootState) =>
  state.wizard.currentMajorStep;

export const selectWizardData = (state: RootState) => state.wizard.data;

export const selectWizardUserId = (state: RootState) => state.wizard.userId;

export const selectWizardIsLoading = (state: RootState) =>
  state.wizard.isLoading;

export const selectWizardCreateAccountError = (state: RootState) =>
  state.wizard.createAccountError;

export const selectWizardIsEmailVerified = (state: RootState) =>
  state.wizard.isEmailVerified;

export const selectWizardOtpRequestStatus = (state: RootState) =>
  state.wizard.otpRequestStatus;

export const selectWizardOtpVerifyStatus = (state: RootState) =>
  state.wizard.otpVerifyStatus;

export const selectWizardOtpError = (state: RootState) =>
  state.wizard.otpError;

export const selectWizardOtpLastSentAt = (state: RootState) =>
  state.wizard.otpLastSentAt;

export const selectWizardPanelState = (state: RootState) =>
  state.wizard.panelState;

export const selectWizardSuggestions = (state: RootState) =>
  state.wizard.suggestions;

export const selectWizardStatus = (state: RootState) =>
  state.wizard.wizardStatus;

export const selectWizardResumeStatus = (state: RootState) =>
  state.wizard.resumeStatus;
