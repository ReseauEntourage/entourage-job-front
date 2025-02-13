import _ from 'lodash';
import {
  FlattenedOnboardingFormData,
  OnboardingErrorMessages,
  OnboardingFormData,
  OnboardingStepContent,
  OnboardingStepContents,
} from 'src/components/backoffice/onboarding/Onboarding.types';
import { assertIsDefined } from 'src/utils/asserts';
import { sendStepDataOnboardingAdapter } from './onboarding.adapters';
import { RootState } from './onboarding.slice';
import { flattenOnboardingDataByRole } from './onboarding.utils';

export const selectShouldLaunchOnboarding = (state: RootState) =>
  state.onboarding.shouldLaunchOnboarding;

export const sendStepDataSelectors =
  sendStepDataOnboardingAdapter.getSelectors<RootState>(
    (state) => state.onboarding.sendStepData
  );

export const selectUserRoleOnboarding = (state: RootState) =>
  state.onboarding.userRole;

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

  const userRole = selectUserRoleOnboarding(state);

  if (!userRole) {
    return null;
  }
  return state.onboarding.data[currentStep]?.[userRole] || null;
}

export function selectOnboardingCurrentStepContent(
  state: RootState
): OnboardingStepContent | null {
  const currentStep = selectDefinedOnboardingCurrentStep(state);
  const userRole = selectUserRoleOnboarding(state);

  if (!userRole) {
    return null;
  }
  const stepContent = OnboardingStepContents[currentStep]?.[userRole];

  return stepContent;
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

    const userRole = selectUserRoleOnboarding(state);

    if (!userRole) {
      return null;
    }

    // Flatten the union of all the form values to get each key and its value
    // That way we are able to use the name of the specific field key to get its value if another form in the onboarding process needs the value of a preceding form
    const allStepsDataForSelectedRole = flattenOnboardingDataByRole(
      data,
      userRole
    );

    return stepContent.dependsOn.reduce((acc, curr) => {
      return { ...acc, [curr]: allStepsDataForSelectedRole[curr] };
    }, {} as FlattenedOnboardingFormData);
  }

  return null;
}
