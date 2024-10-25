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
  SkippedByKeysUnion,
} from 'src/components/registration/Registration.types';
import {
  flattenRegistrationDataByRole,
  incrementRegistrationStep,
} from 'src/components/registration/Registration.utils';
import { ANTENNE_INFO } from 'src/constants';
import { USER_ROLES, UserRole } from 'src/constants/users';
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

  if (!selectedRole) return undefined;

  const allStepsDataForSelectedRole = flattenRegistrationDataByRole(
    data,
    selectedRole
  );

  return Array.isArray(allStepsDataForSelectedRole.program)
    ? allStepsDataForSelectedRole.program?.[0]
    : allStepsDataForSelectedRole.program;
}

export function selectDefinedRegistrationSelectedProgram(state: RootState) {
  const selectedProgram = selectRegistrationSelectedProgram(state);

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
  const selectedRole = selectDefinedRegistrationSelectedRole(state) as UserRole;

  const selectedProgram = selectDefinedRegistrationSelectedProgram(state);

  if (selectedRole === USER_ROLES.REFERRER) {
    return LastStepContent[selectedRole];
  }
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
  let skipNextStep = false;

  if (skippedByArray && valuesFromOtherStep) {
    const keys = Object.keys(skippedByArray) as SkippedByKeysUnion[];

    // All conditions should be met to skip the step
    keys.some((key) => {
      let thisKeyShouldSkip = false;

      // Keys with custom logic
      if (key === 'notEligibleFor360') {
        const { birthDate } =
          valuesFromOtherStep as FlattenedRegistrationFormData;
        const { department } =
          valuesFromOtherStep as FlattenedRegistrationFormData;

        const isDepartmentEligible = !!ANTENNE_INFO.find((antenne) => {
          return department.value.includes(antenne.dpt);
        });

        const maxBirthdate = new Date();
        maxBirthdate.setFullYear(maxBirthdate.getFullYear() - 31);
        const realBirthdate = new Date(birthDate);
        const isAgeEligible = maxBirthdate <= realBirthdate;

        thisKeyShouldSkip = !isDepartmentEligible || !isAgeEligible;
      }

      // Keys with simple logic
      else if (valuesFromOtherStep[key as RegistrationFormDataKeys]) {
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
