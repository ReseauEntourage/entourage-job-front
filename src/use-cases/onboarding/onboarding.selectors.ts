import _ from 'lodash';
import {
  OnboardingPageContent,
  OnboardingPageContents,
  OnboardingStep,
  OnboardingSteps,
  StepsData,
} from 'src/components/onboarding/Onboarding/Onboarding.types';
import { RootState } from './onboarding.slice';

export function selectIsEmptyOnboardingData(state: RootState) {
  return _.isEmpty(state.onboarding.data);
}

export function selectOnboardingData(state: RootState) {
  return state.onboarding.data;
}

export function selectIsFirstOnboardingStep(state: RootState) {
  return state.onboarding.currentStep === OnboardingSteps.FIRST;
}

export function selectIsLastOnboardingStep(state: RootState) {
  return state.onboarding.currentStep === OnboardingSteps.LAST;
}

export function selectOnboardingNextStep(state: RootState): OnboardingStep {
  const currentStepNumber: number = parseInt(
    state.onboarding.currentStep.split('-')[1],
    10
  );
  return `step-${currentStepNumber + 1}`;
}

export function selectIsOnboardingLoading(state: RootState) {
  return state.onboarding.isLoading;
}

export function selectOnboardingCurrentStepData(
  state: RootState
): StepsData[OnboardingStep] {
  return state.onboarding.data[state.onboarding.currentStep];
}

export function selectOnboardingCurrentStepContent(
  state: RootState
): OnboardingPageContent {
  return OnboardingPageContents[state.onboarding.currentStep];
}
