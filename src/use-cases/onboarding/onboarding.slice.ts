import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingStep } from 'src/components/backoffice/onboarding/Onboarding.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  validateFirstSecondStepOnboardingAdapter,
  validateLastStepOnboardingAdapter,
} from './onboarding.adapters';

export interface State {
  validateFirstSecondStepOnboarding: RequestState<
    typeof validateFirstSecondStepOnboardingAdapter
  >;
  validateLastStepOnboarding: RequestState<
    typeof validateLastStepOnboardingAdapter
  >;
  currentStep: OnboardingStep;
  shouldLaunchOnboarding: boolean;
}

const initialState: State = {
  validateFirstSecondStepOnboarding:
    validateFirstSecondStepOnboardingAdapter.getInitialState(),
  validateLastStepOnboarding:
    validateLastStepOnboardingAdapter.getInitialState(),
  currentStep: 0,
  shouldLaunchOnboarding: true,
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    ...validateFirstSecondStepOnboardingAdapter.getReducers<State>(
      (state) => state.validateFirstSecondStepOnboarding,
      {
        validateFirstSecondStepOnboardingSucceeded(_state) {},
      }
    ),
    ...validateLastStepOnboardingAdapter.getReducers<State>(
      (state) => state.validateLastStepOnboarding,
      {
        validateLastStepOnboardingSucceeded(_state) {},
      }
    ),
    launchOnboarding() {},
    setOnboardingStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
    },
    increaseOnboardingStep(state) {
      state.currentStep += 1;
    },
    decreaseOnboardingStep(state) {
      state.currentStep -= 1;
    },
    endOnboarding(state) {
      state.currentStep = 0;
      state.shouldLaunchOnboarding = false;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
