import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OnboardingStep,
  OnboardingSteps,
  StepsData,
} from 'src/components/onboarding/Onboarding/Onboarding.types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { createUserAdapter } from './onboarding.adapters';

export interface State {
  createUser: RequestState<typeof createUserAdapter>;
  currentStep: OnboardingStep;
  data: StepsData;
  isLoading: boolean;
}

const initialState: State = {
  createUser: createUserAdapter.getInitialState(),
  currentStep: OnboardingSteps.FIRST,
  data: {},
  isLoading: true,
};

export const slice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    ...createUserAdapter.getReducers<State>((state) => state.createUser, {
      // TODO on creation success, set user data
    }),
    setOnboardingCurrentStepData(
      state,
      action: PayloadAction<StepsData[OnboardingStep]>
    ) {
      state.data[state.currentStep] = action.payload;
    },
    setOnboardingStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
      state.isLoading = true;
    },
    setOnboardingIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
