import _ from 'lodash';
import {
  FlattenedOnboardingFormData,
  OnboardingErrorMessages,
  OnboardingFormData,
  OnboardingStepContent,
} from '@/src/features/backoffice/oldOnboarding/Onboarding.types';
import { assertIsDefined } from 'src/utils/asserts';
import { sendStepDataOnboardingAdapter } from './onboarding.adapters';
import { RootState } from './onboarding.slice';
import {
  flattenOnboardingDataByFlow,
  getOnboardingStepContent,
} from './onboarding.utils';

export const selectShouldLaunchOnboarding = (state: RootState) =>
  state.onboarding.shouldLaunchOnboarding;

export const sendStepDataSelectors =
  sendStepDataOnboardingAdapter.getSelectors<RootState>(
    (state) => state.onboarding.sendStepData
  );

// Ce sélecteur est supprimé car userRole n'existe plus

export const selectOnboardingFlow = (state: RootState) =>
  state.onboarding.onboardingFlow;

export function selectSendStepDataError(state: RootState) {
  return state.onboarding.sendStepDataError;
}

export function selectIsEmptyOnboardingData(state: RootState) {
  return _.isEmpty(state.onboarding.data);
}

export function selectOnboardingData(state: RootState) {
  return state.onboarding.data;
}

export function selectOnboardingCurrentStep(state: RootState) {
  return state.onboarding.currentStep;
}

export function selectDefinedOnboardingCurrentStep(state: RootState) {
  const currentStep = selectOnboardingCurrentStep(state);

  assertIsDefined(currentStep, OnboardingErrorMessages.CURRENT_STEP);

  return currentStep;
}

export function selectIsOnboardingLoading(state: RootState) {
  return state.onboarding.isLoading;
}

export function selectOnboardingCurrentStepData(
  state: RootState
): OnboardingFormData | null {
  const currentStep = selectDefinedOnboardingCurrentStep(state);
  const onboardingFlow = selectOnboardingFlow(state);

  if (!onboardingFlow) {
    return null;
  }
  return state.onboarding.data[currentStep]?.[onboardingFlow] || null;
}

export function selectOnboardingCurrentStepContent(
  state: RootState
): OnboardingStepContent | null {
  const currentStep = selectDefinedOnboardingCurrentStep(state);
  const onboardingFlow = selectOnboardingFlow(state);

  if (!onboardingFlow) {
    return null;
  }
  const flowContent = getOnboardingStepContent(onboardingFlow);
  return flowContent[currentStep];
}

export function selectOnboardingDataFromOtherStep(
  state: RootState
): Partial<OnboardingFormData> | null {
  const stepContent = selectOnboardingCurrentStepContent(state);

  if (!stepContent) {
    return null;
  }

  if (stepContent.dependsOn) {
    const data = selectOnboardingData(state);
    const onboardingFlow = selectOnboardingFlow(state);

    if (!onboardingFlow) {
      return null;
    }

    // Flatten the union of all the form values to get each key and its value
    // That way we are able to use the name of the specific field key to get its value if another form in the onboarding process needs the value of a preceding form
    const allStepsDataForSelectedFlow = flattenOnboardingDataByFlow(
      data,
      onboardingFlow
    );

    return stepContent.dependsOn.reduce((acc, curr) => {
      return { ...acc, [curr]: allStepsDataForSelectedFlow[curr] };
    }, {} as FlattenedOnboardingFormData);
  }

  return null;
}
