import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OnboardingErrorMessages,
  OnboardingFlow,
  OnboardingFormData,
  OnboardingStep,
  OnboardingStepData,
} from '@/src/features/backoffice/onboardingLegacy/Onboarding.types';
import { SliceRootState } from '@/src/store/utils';
import { assertIsDefined } from '@/src/utils/asserts';

interface State {
  currentStep: OnboardingStep;
  onboardingFlow: OnboardingFlow | null;
  shouldLaunchOnboarding: boolean;
  data: OnboardingStepData;
  isLoading: boolean;
}

const initialState: State = {
  currentStep: 0,
  onboardingFlow: null,
  data: {},
  shouldLaunchOnboarding: true,
  isLoading: true,
};

export const slice = createSlice({
  name: 'onboardingOld',
  initialState,
  reducers: {
    launchOnboarding(state: State, action: PayloadAction<OnboardingFlow>) {
      state.onboardingFlow = action.payload;
    },
    setOnboardingCurrentStepData(
      state,
      action: PayloadAction<OnboardingFormData>
    ) {
      const { currentStep } = state;
      assertIsDefined(currentStep, OnboardingErrorMessages.CURRENT_STEP);

      const { onboardingFlow } = state;

      // Vérifier que le flux est défini
      assertIsDefined(onboardingFlow, OnboardingErrorMessages.SELECTED_ROLE);

      const currentStepData = state.data[currentStep] || {};

      // Store data using the flow as the key
      state.data[currentStep] = {
        ...currentStepData,
        [onboardingFlow]: action.payload,
      };
    },
    setOnboardingStep(state, action: PayloadAction<OnboardingStep>) {
      state.currentStep = action.payload;
      state.isLoading = true;
    },
    setOnboardingIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    increaseOnboardingStep(state) {
      state.currentStep += 1;
    },
    decreaseOnboardingStep(state) {
      state.currentStep -= 1;
    },
    endOnboarding(state) {
      state.currentStep = 0;
      state.data = {};
      state.shouldLaunchOnboarding = false;
      state.isLoading = true;
      state.onboardingFlow = null;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
