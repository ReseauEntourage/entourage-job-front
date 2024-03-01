import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OnboardingStep,
  OnboardingSteps,
  StepsData,
} from 'src/components/onboarding/Onboarding/Onboarding.types';
import { SliceRootState } from 'src/store/utils';

export interface State {
  currentStep: OnboardingStep;
  data: StepsData;
}

const initialState: State = {
  currentStep: OnboardingSteps.FIRST,
  data: {},
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingCurrentStepData(
      state,
      action: PayloadAction<StepsData[OnboardingStep]>
    ) {
      state.data[state.currentStep] = action.payload;
    },
    setOnboardingStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
