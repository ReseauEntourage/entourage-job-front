import {
  FirstStepContent,
  FlattenedStepData,
  REGISTRATION_FIRST_STEP,
  RegistrationErrorMessages,
  RegistrationStep,
  RegistrationStepContent,
  RegistrationStepContents,
  StepData,
  StepDataKeys,
} from 'src/components/registration/Registration/Registration.types';
import { assertIsDefined } from 'src/utils/asserts';
import { RootState } from './registration.slice';

export function selectIsEmptyRegistrationData(state: RootState) {
  return !state.registration.selectedRole;
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
  const currentStepNumber: number = parseInt(currentStep.split('-')[1], 10);
  return `step-${currentStepNumber + 1}`;
}

export function selectRegistrationSelectedRole(state: RootState) {
  return state.registration.selectedRole;
}

export function selectDefinedRegistrationSelectedRole(state: RootState) {
  const selectedRole = selectRegistrationSelectedRole(state);

  assertIsDefined(selectedRole, RegistrationErrorMessages.SELECTED_ROLE);

  return selectedRole;
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

  return !RegistrationStepContents[nextStep]?.[selectedRole];
}

export function selectIsRegistrationLoading(state: RootState) {
  return state.registration.isLoading;
}

export function selectRegistrationCurrentStepData(
  state: RootState
): StepData | null {
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
): RegistrationStepContent | null {
  const currentStep = selectDefinedRegistrationCurrentStep(state);

  const isFirstStep = selectIsFirstRegistrationStep(state);
  if (isFirstStep) {
    return FirstStepContent;
  }

  const selectedRole = selectDefinedRegistrationSelectedRole(state);

  return RegistrationStepContents[currentStep]?.[selectedRole] || null;
}

export function selectRegistrationDataFromOtherStepForDefaultValue(
  state: RootState
): Partial<StepData> | null {
  const isFirstStep = selectIsFirstRegistrationStep(state);
  const stepContent = selectRegistrationCurrentStepContent(state);

  if (!isFirstStep && stepContent?.dependsOn) {
    const allData = selectRegistrationData(state);

    const allSteps: RegistrationStep[] = Object.keys(
      allData
    ) as RegistrationStep[];

    const selectedRole = selectDefinedRegistrationSelectedRole(state);

    // Flatten the union of all the form values to get each key and its value, to be able to use the name of the specific field to get its value if another form in the registration process needs the value of a preceding form
    const allStepsDataForSelectedRole = allSteps.reduce((acc, curr) => {
      const stepDataForSelectedRole = allData[curr]?.[selectedRole];
      if (stepDataForSelectedRole) {
        return {
          ...acc,
          ...stepDataForSelectedRole,
        };
      }
      return acc;
    }, {} as FlattenedStepData);

    return {
      [stepContent.dependsOn]:
        allStepsDataForSelectedRole[stepContent.dependsOn],
    };
  }

  return null;
}
