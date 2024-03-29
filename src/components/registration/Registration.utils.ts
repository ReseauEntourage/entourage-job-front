import { NormalUserRole } from 'src/constants/users';
import {
  FlattenedRegistrationFormData,
  RegistrationStep,
  RegistrationStepData,
} from './Registration.types';

export const flattenRegistrationDataByRole = (
  data: RegistrationStepData,
  selectedRole: NormalUserRole
) => {
  const allSteps: RegistrationStep[] = Object.keys(data) as RegistrationStep[];

  return allSteps.reduce((acc, curr) => {
    const stepDataForSelectedRole = data[curr]?.[selectedRole];

    if (stepDataForSelectedRole) {
      return {
        ...acc,
        ...stepDataForSelectedRole,
      };
    }
    return acc;
  }, {} as FlattenedRegistrationFormData);
};

export const incrementRegistrationStep = (
  step: RegistrationStep
): RegistrationStep => {
  const stepNumber: number = parseInt(step.split('-')[1], 10);
  return `step-${stepNumber + 1}`;
};
