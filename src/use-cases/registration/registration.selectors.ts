import _ from 'lodash';
import {
  LastStepContent,
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationFlows,
  RegistrationStepSelectFlow,
} from '@/src/components/registration/registration.config';
import {
  RegistrationFormDataKeys,
  RegistrationLastStepContent,
  RegistrationStep,
  RegistrationStepContent,
  SkippedByKeysUnion,
} from '@/src/components/registration/registration.types';
import { incrementRegistrationStep } from '@/src/components/registration/registration.utils';
import { assertIsDefined } from 'src/utils/asserts';
import { createUserAdapter } from './registration.adapters';
import { RootState } from './registration.slice';

export const createUserSelectors = createUserAdapter.getSelectors<RootState>(
  (state) => state.registration.createUser
);

export function selectCreateUserError(state: RootState) {
  return state.registration.createUserError;
}

export function selectInvitationId(state: RootState) {
  return state.registration.invitationId;
}

export function selectIsEmptyRegistrationData(state: RootState) {
  return _.isEmpty(state.registration.data);
}

export function selectRegistrationData(state: RootState) {
  return state.registration.data;
}

export function selectRegistrationCurrentStep(state: RootState) {
  return state.registration.currentStep;
}

export function selectDefinedRegistrationCurrentStep(state: RootState) {
  const currentStep = selectRegistrationCurrentStep(state);

  assertIsDefined(currentStep, RegistrationErrorMessages.CURRENT_STEP);

  return currentStep;
}

export function selectRegistrationNextStep(state: RootState): number {
  const currentStep = selectDefinedRegistrationCurrentStep(state);
  return incrementRegistrationStep(currentStep);
}

export function selectRegistrationSelectedFlow(state: RootState) {
  return state.registration.selectedFlow;
}

export function selectDefinedRegistrationSelectedFlow(state: RootState) {
  const selectedFlow = selectRegistrationSelectedFlow(state);

  // assertIsDefined(selectedFlow, RegistrationErrorMessages.SELECTED_FLOW);
  return selectedFlow;
}

export function selectIsFirstRegistrationStep(state: RootState) {
  return state.registration.currentStep === REGISTRATION_FIRST_STEP;
}

export function selectNextIsLastRegistrationStep(state: RootState) {
  const nextStep = selectRegistrationNextStep(state);

  const selectedFlow = selectRegistrationSelectedFlow(state);
  if (!selectedFlow) {
    return false;
  }
  const lastStep = RegistrationFlows[selectedFlow]?.length as RegistrationStep;
  return nextStep >= lastStep;
}

export function selectIsLastRegistrationStep(state: RootState) {
  const nextStep = selectRegistrationNextStep(state);

  const selectedFlow = selectRegistrationSelectedFlow(state);
  if (!selectedFlow) {
    return false;
  }
  const lastStep = RegistrationFlows[selectedFlow]?.length as RegistrationStep;
  return nextStep >= lastStep;
}

export function selectRegistrationIsEnded(state: RootState) {
  return state.registration.isEnded;
}

export function selectIsRegistrationLoading(state: RootState) {
  return state.registration.isLoading;
}

export function selectRegistrationCurrentStepContent(
  state: RootState
): RegistrationStepContent {
  const currentStep = selectDefinedRegistrationCurrentStep(state);
  const currentFlow = selectDefinedRegistrationSelectedFlow(state);

  const steps = currentFlow ? RegistrationFlows[currentFlow] : undefined;

  if (!steps) {
    return RegistrationStepSelectFlow;
  }

  const currentStepContent = steps[currentStep];

  return currentStepContent ?? RegistrationStepSelectFlow;
}

export function selectRegistrationConfirmationStepContent(
  state: RootState
): RegistrationLastStepContent {
  const selectedFlow = selectDefinedRegistrationSelectedFlow(state);

  if (!selectedFlow) {
    throw new Error('Registration flow is not defined');
  }

  const content = LastStepContent[selectedFlow];

  if (!content) {
    throw new Error('Registration last step content is not defined');
  }

  return content;
}

export function selectRegistrationShouldSkipStep(state: RootState) {
  const data = selectRegistrationData(state);
  const stepContent = selectRegistrationCurrentStepContent(state);

  if (!data) {
    return false;
  }
  const skippedByArray = stepContent.skippedBy;
  let skipNextStep = false;

  if (skippedByArray && data) {
    const keys = Object.keys(skippedByArray) as SkippedByKeysUnion[];

    // All conditions should be met to skip the step
    keys.some((key) => {
      let thisKeyShouldSkip = false;

      // Keys with simple logic
      if (data[key as RegistrationFormDataKeys]) {
        // check if skippedByArray[key] contains a value from valuesFromOtherStep[key]
        if (Array.isArray(data[key as RegistrationFormDataKeys])) {
          thisKeyShouldSkip = _.isEqual(
            data[key as RegistrationFormDataKeys],
            skippedByArray[key]
          );
        } else {
          thisKeyShouldSkip = _.includes(
            skippedByArray[key] as string[],
            data[key as RegistrationFormDataKeys]
          );
        }
      }
      return (skipNextStep = skipNextStep || thisKeyShouldSkip);
    });
  }
  return skipNextStep;
}
