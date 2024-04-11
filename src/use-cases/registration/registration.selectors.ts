import _ from 'lodash';
import {
  FirstStepContent,
  FlattenedRegistrationFormData,
  LastStepContent,
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationStep,
  RegistrationStepContent,
  RegistrationStepContents,
  RegistrationFormData,
  RegistrationFormDataKeys,
} from 'src/components/registration/Registration.types';
import {
  flattenRegistrationDataByRole,
  incrementRegistrationStep,
} from 'src/components/registration/Registration.utils';
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

export function selectRegistrationNextStep(state: RootState): RegistrationStep {
  const currentStep = selectDefinedRegistrationCurrentStep(state);
  return incrementRegistrationStep(currentStep);
}

export function selectRegistrationSelectedRole(state: RootState) {
  return state.registration.selectedRole;
}

export function selectDefinedRegistrationSelectedRole(state: RootState) {
  const selectedRole = selectRegistrationSelectedRole(state);

  assertIsDefined(selectedRole, RegistrationErrorMessages.SELECTED_ROLE);

  return selectedRole;
}

export function selectRegistrationSelectedProgram(state: RootState) {
  const data = selectRegistrationData(state);
  const selectedRole = selectRegistrationSelectedRole(state);

  if (!selectedRole) return null;
  
  const allStepsDataForSelectedRole = flattenRegistrationDataByRole(
    data,
    selectedRole
  );

  return allStepsDataForSelectedRole.program?.[0];
}

export function selectDefinedRegistrationSelectedProgram(state: RootState) {
  const selectedProgram = selectRegistrationSelectedProgram(state);

  assertIsDefined(selectedProgram, RegistrationErrorMessages.SELECTED_PROGRAM);

  return selectedProgram;
}

export function selectIsFirstRegistrationStep(state: RootState) {
  return state.registration.currentStep === REGISTRATION_FIRST_STEP;
}

export function selectIsLastRegistrationStep(state: RootState) {
  const nextStep = selectRegistrationNextStep(state);
  const isFirstStep = selectIsFirstRegistrationStep(state);

  if (isFirstStep) {
    return false;
  }

  const selectedRole = selectDefinedRegistrationSelectedRole(state);

  return (
    !RegistrationStepContents[nextStep] ||
    !RegistrationStepContents[nextStep][selectedRole]
  );
}

export function selectIsRegistrationLoading(state: RootState) {
  return state.registration.isLoading;
}

export function selectRegistrationCurrentStepData(
  state: RootState
): RegistrationFormData | null {
  const currentStep = selectDefinedRegistrationCurrentStep(state);

  const isFirstStep = selectIsFirstRegistrationStep(state);

  if (isFirstStep) {
    const selectedRole = selectRegistrationSelectedRole(state);
    return selectedRole ? { role: [selectedRole] } : null;
  }

  const selectedRole = selectDefinedRegistrationSelectedRole(state);

  return state.registration.data[currentStep]?.[selectedRole] || null;
}

export function selectRegistrationCurrentStepContent(
  state: RootState
): RegistrationStepContent {
  const currentStep = selectDefinedRegistrationCurrentStep(state);

  const isFirstStep = selectIsFirstRegistrationStep(state);

  if (isFirstStep) {
    return FirstStepContent;
  }

  const selectedRole = selectDefinedRegistrationSelectedRole(state);

  const stepContent = RegistrationStepContents[currentStep][selectedRole];

  assertIsDefined(stepContent, RegistrationErrorMessages.STEP_CONTENT);

  return stepContent;
}

export function selectRegistrationConfirmationStepContent(
  state: RootState
): LastStepContent {
  const selectedRole = selectDefinedRegistrationSelectedRole(state);

  const selectedProgram = selectDefinedRegistrationSelectedProgram(state);

  return LastStepContent[selectedRole][selectedProgram];
}

export function selectRegistrationDataFromOtherStep(
  state: RootState
): Partial<RegistrationFormData> | null {
  const isFirstStep = selectIsFirstRegistrationStep(state);
  const stepContent = selectRegistrationCurrentStepContent(state);

  if (!isFirstStep && stepContent.dependsOn) {
    const data = selectRegistrationData(state);

    const selectedRole = selectDefinedRegistrationSelectedRole(state);

    // Flatten the union of all the form values to get each key and its value
    // That way we are able to use the name of the specific field key to get its value if another form in the registration process needs the value of a preceding form
    const allStepsDataForSelectedRole = flattenRegistrationDataByRole(
      data,
      selectedRole
    );

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

  if (skippedByArray && valuesFromOtherStep) {
    const keys = Object.keys(skippedByArray) as RegistrationFormDataKeys[];

    return keys.some((key) => {
      if (valuesFromOtherStep[key]) {
        return _.isEqual(valuesFromOtherStep[key], skippedByArray[key]);
      }
      return false;
    });
  }
  return false;
}
