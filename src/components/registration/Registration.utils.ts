import { UtmParameters } from '@/src/hooks/queryParams/useUTM';
import { RegistrableUserRole } from 'src/constants/users';
import {
  FlattenedRegistrationFormData,
  RegistrationStep,
  RegistrationStepData,
} from './Registration.types';

export const flattenRegistrationDataByRole = (
  data: RegistrationStepData,
  selectedRole: RegistrableUserRole
): FlattenedRegistrationFormData => {
  const allSteps: RegistrationStep[] = Object.keys(data) as RegistrationStep[];

  return allSteps.reduce((acc, curr) => {
    const stepDataForSelectedRole = data[curr]?.[selectedRole];

    if (stepDataForSelectedRole) {
      return {
        ...stepDataForSelectedRole,
        ...acc,
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

export const getUtmFromLocalStorage = (): UtmParameters[] => {
  const utmParameters: UtmParameters[] = [];

  Object.values(UtmParameters).forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      utmParameters[key] = value;
    }
  });

  return utmParameters;
};
