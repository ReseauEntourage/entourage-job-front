import _ from 'lodash';
import {
  LastStepContent,
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationFlows,
  RegistrationStepSelectFlow,
} from '@/src/components/registration/registration.config';
import {
  FlattenedRegistrationFormData,
  RegistrationFormData,
  RegistrationFormDataKeys,
  RegistrationLastStepContent,
  RegistrationStep,
  RegistrationStepContent,
  SkippedByKeysUnion,
} from '@/src/components/registration/registration.types';
import {
  flattenRegistrationData,
  incrementRegistrationStep,
} from '@/src/components/registration/registration.utils';
import { assertIsDefined } from 'src/utils/asserts';
import { createUserAdapter } from './registration.adapters';
import { RootState } from './registration.slice';

export const createUserSelectors = createUserAdapter.getSelectors<RootState>(
  (state) => state.registration.createUser
);

export function selectCreateUserError(state: RootState) {
  return state.registration.createUserError;
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

export function selectRegistrationCurrentStepData(
  state: RootState
): RegistrationFormData | null {
  const currentStep = selectDefinedRegistrationCurrentStep(state);

  return state.registration.data[currentStep] || null;
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

export function selectRegistrationDataFromOtherStep(
  state: RootState
): Partial<RegistrationFormData> | null {
  const isFirstStep = selectIsFirstRegistrationStep(state);
  const stepContent = selectRegistrationCurrentStepContent(state);

  if (!isFirstStep && stepContent.dependsOn) {
    const data = selectRegistrationData(state);

    const selectedFlow = selectDefinedRegistrationSelectedFlow(state);

    assertIsDefined(
      selectedFlow,
      'Registration flow is not defined for selectRegistrationDataFromOtherStep'
    );
    // Flatten the union of all the form values to get each key and its value
    // That way we are able to use the name of the specific field key to get its value if another form in the registration process needs the value of a preceding form
    const allStepsDataForSelectedRole = flattenRegistrationData(data);

    return stepContent.dependsOn.reduce((acc, curr) => {
      return { ...acc, [curr]: allStepsDataForSelectedRole[curr] };
    }, {} as FlattenedRegistrationFormData);
  }

  return null;
}

export function selectRegistrationShouldSkipStep(state: RootState) {
  const valuesFromOtherStep = selectRegistrationDataFromOtherStep(state);
  const stepContent = selectRegistrationCurrentStepContent(state);

  const skippedByArray = stepContent.skippedBy;
  let skipNextStep = false;

  if (skippedByArray && valuesFromOtherStep) {
    const keys = Object.keys(skippedByArray) as SkippedByKeysUnion[];

    // All conditions should be met to skip the step
    keys.some((key) => {
      let thisKeyShouldSkip = false;

      // Keys with simple logic
      if (valuesFromOtherStep[key as RegistrationFormDataKeys]) {
        // check if skippedByArray[key] contains a value from valuesFromOtherStep[key]
        if (
          Array.isArray(valuesFromOtherStep[key as RegistrationFormDataKeys])
        ) {
          thisKeyShouldSkip = _.isEqual(
            valuesFromOtherStep[key as RegistrationFormDataKeys],
            skippedByArray[key]
          );
        } else {
          thisKeyShouldSkip = _.includes(
            skippedByArray[key] as string[],
            valuesFromOtherStep[key as RegistrationFormDataKeys]
          );
        }
      }
      return (skipNextStep = skipNextStep || thisKeyShouldSkip);
    });
  }
  return skipNextStep;
}
