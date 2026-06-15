import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceRootState } from 'src/store/utils';
import {
  OtpError,
  PanelState,
  RequestStatus,
  SuggestedProfile,
  WizardFormData,
  WizardSubStep,
} from './wizard.types';

interface WizardState {
  currentMajorStep: 1 | 2 | 3;
  currentSubStep: WizardSubStep;
  isLoading: boolean;
  data: Partial<WizardFormData>;
  userId: string | null;
  createAccountError: 'conflict' | 'unknown' | null;
  isEmailVerified: boolean;
  otpRequestStatus: RequestStatus;
  otpVerifyStatus: RequestStatus;
  otpError: OtpError | null;
  otpLastSentAt: number | null;
  panelState: PanelState;
  suggestions: SuggestedProfile[];
  wizardStatus: 'idle' | 'in_progress' | 'completed';
  resumeStatus: RequestStatus;
}

const initialState: WizardState = {
  currentMajorStep: 1,
  currentSubStep: '1.1-nudges',
  isLoading: false,
  data: {},
  userId: null,
  createAccountError: null,
  isEmailVerified: false,
  otpRequestStatus: 'IDLE',
  otpVerifyStatus: 'IDLE',
  otpError: null,
  otpLastSentAt: null,
  panelState: 'teaser',
  suggestions: [],
  wizardStatus: 'idle',
  resumeStatus: 'IDLE',
};

function majorStepFromSubStep(subStep: WizardSubStep): 1 | 2 | 3 {
  if (subStep.startsWith('1.')) return 1;
  if (subStep.startsWith('2.')) return 2;
  return 3;
}

export const slice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    moveToSubStep(state, action: PayloadAction<WizardSubStep>) {
      state.currentSubStep = action.payload;
      if (action.payload !== 'done') {
        state.currentMajorStep = majorStepFromSubStep(action.payload);
      }
    },
    mergeWizardData(state, action: PayloadAction<Partial<WizardFormData>>) {
      state.data = { ...state.data, ...action.payload };
    },
    // Account creation
    createAccountRequested(state, _action: PayloadAction<void>) {
      state.isLoading = true;
      state.createAccountError = null;
    },
    createAccountSucceeded(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.userId = action.payload;
      state.createAccountError = null;
    },
    createAccountFailed(
      state,
      action: PayloadAction<'conflict' | 'unknown'>
    ) {
      state.isLoading = false;
      state.createAccountError = action.payload;
    },
    // OTP
    sendOtpRequested(state) {
      state.otpRequestStatus = 'REQUESTED';
      state.otpError = null;
    },
    sendOtpSucceeded(state) {
      state.otpRequestStatus = 'SUCCEEDED';
      state.otpLastSentAt = Date.now();
    },
    sendOtpFailed(state) {
      state.otpRequestStatus = 'FAILED';
    },
    verifyOtpRequested(state, _action: PayloadAction<{ code: string }>) {
      state.otpVerifyStatus = 'REQUESTED';
      state.otpError = null;
    },
    verifyOtpSucceeded(state) {
      state.otpVerifyStatus = 'SUCCEEDED';
      state.isEmailVerified = true;
    },
    verifyOtpFailed(state, action: PayloadAction<OtpError>) {
      state.otpVerifyStatus = 'FAILED';
      state.otpError = action.payload;
    },
    // Resume
    resumeWizardRequested(state) {
      state.resumeStatus = 'REQUESTED';
    },
    resumeWizardSucceeded(
      state,
      action: PayloadAction<{
        nextStep: WizardSubStep;
        userData: Partial<WizardFormData>;
      }>
    ) {
      state.resumeStatus = 'SUCCEEDED';
      state.currentSubStep = action.payload.nextStep;
      if (action.payload.nextStep !== 'done') {
        state.currentMajorStep = majorStepFromSubStep(action.payload.nextStep);
      }
      state.data = { ...state.data, ...action.payload.userData };
      state.wizardStatus = 'in_progress';
    },
    resumeWizardFailed(state) {
      state.resumeStatus = 'FAILED';
    },
    // Panel
    setPanelState(state, action: PayloadAction<PanelState>) {
      state.panelState = action.payload;
    },
    setSuggestions(state, action: PayloadAction<SuggestedProfile[]>) {
      state.suggestions = action.payload;
    },
    setWizardCompleted(state) {
      state.wizardStatus = 'completed';
      state.currentSubStep = 'done';
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
