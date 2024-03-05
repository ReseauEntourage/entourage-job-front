import {
  AllStepData,
  FirstStepContent,
  REGISTRATION_FIRST_STEP,
  RegistrationStep,
  RegistrationStepContent,
  RegistrationStepContents,
} from 'src/components/registration/Registration/Registration.types';
import { RootState } from './registration.slice';

export function selectIsEmptyRegistrationData(state: RootState) {
  return !state.registration.selectedRole;
}

export function selectRegistrationData(state: RootState) {
  return state.registration.data;
}

export function selectRegistrationStep(state: RootState) {
  return state.registration.currentStep;
}

export function selectRegistrationCurrentStep(state: RootState) {
  const currentStep = selectRegistrationStep(state);

  if (!currentStep) {
    throw new Error('No registration current step');
  }
  return currentStep;
}

export function selectRegistrationNextStep(state: RootState): RegistrationStep {
  const currentStep = selectRegistrationCurrentStep(state);
  const currentStepNumber: number = parseInt(currentStep.split('-')[1], 10);
  return `step-${currentStepNumber + 1}`;
}

export function selectRegistrationSelectedRole(state: RootState) {
  const { selectedRole } = state.registration;
  if (!selectedRole) {
    throw new Error('No registration selected role');
  }
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

  const selectedRole = selectRegistrationSelectedRole(state);

  return !RegistrationStepContents[nextStep]?.[selectedRole];
}

export function selectIsRegistrationLoading(state: RootState) {
  return state.registration.isLoading;
}

export function selectRegistrationCurrentStepData(
  state: RootState
): AllStepData | null {
  const currentStep = selectRegistrationCurrentStep(state);

  const isFirstStep = selectIsFirstRegistrationStep(state);

  if (isFirstStep) {
    const { selectedRole } = state.registration;
    return selectedRole ? { role: [selectedRole] } : null;
  }

  const selectedRole = selectRegistrationSelectedRole(state);

  return state.registration.data[currentStep]?.[selectedRole];
}

export function selectRegistrationCurrentStepContent(
  state: RootState
): RegistrationStepContent | null {
  const currentStep = selectRegistrationCurrentStep(state);

  const isFirstStep = selectIsFirstRegistrationStep(state);
  if (isFirstStep) {
    return FirstStepContent;
  }

  const selectedRole = selectRegistrationSelectedRole(state);

  return RegistrationStepContents[currentStep]?.[selectedRole] || null;
}
