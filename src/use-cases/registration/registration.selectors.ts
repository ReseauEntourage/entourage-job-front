import _ from 'lodash';
import {
  REGISTRATION_FIRST_STEP,
  RegistrationPageContent,
  RegistrationPageContents,
  RegistrationStep,
  StepsData,
} from 'src/components/registration/Registration/Registration.types';
import { RootState } from './registration.slice';

export function selectIsEmptyRegistrationData(state: RootState) {
  return _.isEmpty(state.registration.data);
}

export function selectRegistrationData(state: RootState) {
  return state.registration.data;
}

export function selectRegistrationNextStep(state: RootState): RegistrationStep {
  const currentStepNumber: number = parseInt(
    state.registration.currentStep.split('-')[1],
    10
  );
  return `step-${currentStepNumber + 1}`;
}

export function selectRegistrationSelectedRole(state: RootState) {
  return state.registration.data[REGISTRATION_FIRST_STEP]?.role?.[0];
}

export function selectIsFirstRegistrationStep(state: RootState) {
  return state.registration.currentStep === REGISTRATION_FIRST_STEP;
}

export function selectIsLastRegistrationStep(state: RootState) {
  const nextStep = selectRegistrationNextStep(state);
  const selectedRole = selectRegistrationSelectedRole(state);

  return !RegistrationPageContents[nextStep]?.[selectedRole];
}

export function selectIsRegistrationLoading(state: RootState) {
  return state.registration.isLoading;
}

export function selectRegistrationCurrentStepData(
  state: RootState
): StepsData[RegistrationStep] {
  const isFirstStep = selectIsFirstRegistrationStep(state);
  if (isFirstStep) {
    return state.registration.data[state.registration.currentStep];
  }

  const selectedRole = selectRegistrationSelectedRole(state);

  return state.registration.data[state.registration.currentStep]?.[
    selectedRole
  ];
}

export function selectRegistrationCurrentStepContent(
  state: RootState
): RegistrationPageContent {
  return RegistrationPageContents[state.registration.currentStep];
}
