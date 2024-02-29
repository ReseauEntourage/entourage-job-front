import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OnboardingStep,
  StepData,
} from 'src/components/onboarding/Onboarding/Onboarding.types';
import { SliceRootState } from 'src/store/utils';

export interface State {
  currentStep: OnboardingStep;
  data: StepData;
}

const initialState: State = {
  currentStep: 'step-1',
  data: {},
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingCurrentStepData(
      state,
      action: PayloadAction<StepData[OnboardingStep]>
    ) {
      state.data[state.currentStep] = action.payload;
    },
    setOnboardingStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
