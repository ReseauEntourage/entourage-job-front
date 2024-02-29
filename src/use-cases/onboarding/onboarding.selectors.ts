import _ from 'lodash';
import {
  OnboardingStep,
  StepData,
} from 'src/components/onboarding/Onboarding/Onboarding.types';
import { RootState } from './onboarding.slice';

export function selectIsEmptyOnboardingData(state: RootState) {
  return _.isEmpty(state.onboarding.data);
}

export function selectOnboardingData(state: RootState) {
  return state.onboarding.data;
}

export function selectOnboardingCurrentStepData(
  state: RootState
): StepData[OnboardingStep] {
  return state.onboarding.data[state.onboarding.currentStep];
}
