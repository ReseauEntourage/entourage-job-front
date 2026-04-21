import _ from 'lodash';
import {
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationFlows,
  RegistrationStepSelectFlow,
} from '@/src/features/registration/registration.config';
import {
  RegistrationFormDataKeys,
  RegistrationStep,
  RegistrationStepContent,
  SkippedByKeysUnion,
} from '@/src/features/registration/registration.types';
import { incrementRegistrationStep } from '@/src/features/registration/registration.utils';
import { assertIsDefined } from 'src/utils/asserts';
import { createUserAdapter } from './registration.adapters';
import { RootState } from './registration.slice';

export const createUserSelectors = createUserAdapter.getSelectors<RootState>(
  (state) => state.registration.createUser
);

export const selectCreateUserError = (state: RootState) => {
  return state.registration.createUserError;
};

export const selectInvitationId = (state: RootState) => {
  return state.registration.invitationId;
};

export const selectRegistrationData = (state: RootState) => {
  return state.registration.data;
};

export const selectRegistrationCurrentStep = (state: RootState) => {
  return state.registration.currentStep;
};

const selectDefinedRegistrationCurrentStep = (state: RootState) => {
  const currentStep = selectRegistrationCurrentStep(state);

  assertIsDefined(currentStep, RegistrationErrorMessages.CURRENT_STEP);

  return currentStep;
};

export const selectRegistrationNextStep = (state: RootState): number => {
  const currentStep = selectDefinedRegistrationCurrentStep(state);
  return incrementRegistrationStep(currentStep);
};

export const selectRegistrationSelectedFlow = (state: RootState) => {
  return state.registration.selectedFlow;
};

export const selectDefinedRegistrationSelectedFlow = (state: RootState) => {
  const selectedFlow = selectRegistrationSelectedFlow(state);

  // assertIsDefined(selectedFlow, RegistrationErrorMessages.SELECTED_FLOW);
  return selectedFlow;
};

export const selectIsFirstRegistrationStep = (state: RootState) => {
  return state.registration.currentStep === REGISTRATION_FIRST_STEP;
};

export const selectNextIsLastRegistrationStep = (state: RootState) => {
  const nextStep = selectRegistrationNextStep(state);

  const selectedFlow = selectRegistrationSelectedFlow(state);
  if (!selectedFlow) {
    return false;
  }
  const lastStep = RegistrationFlows[selectedFlow]?.length as RegistrationStep;
  return nextStep >= lastStep;
};

export const selectRegistrationIsEnded = (state: RootState) => {
  return state.registration.isEnded;
};

export const selectIsRegistrationLoading = (state: RootState) => {
  return state.registration.isLoading;
};

export const selectRegistrationCurrentStepContent = (
  state: RootState
): RegistrationStepContent => {
  const currentStep = selectDefinedRegistrationCurrentStep(state);
  const currentFlow = selectDefinedRegistrationSelectedFlow(state);

  const steps = currentFlow ? RegistrationFlows[currentFlow] : undefined;

  if (!steps) {
    return RegistrationStepSelectFlow;
  }

  const currentStepContent = steps[currentStep];

  return currentStepContent ?? RegistrationStepSelectFlow;
};

export const selectRegistrationShouldSkipStep = (state: RootState) => {
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
};
