import { UtmParameters } from '@/src/hooks/queryParams/useUTM';
import {
  FlattenedRegistrationFormData,
  RegistrationStepData,
} from './registration.types';

export const flattenRegistrationData = (
  data: RegistrationStepData
): FlattenedRegistrationFormData => {
  const allSteps: number[] = Object.keys(data).map((key) => parseInt(key, 10));

  return allSteps.reduce((acc, curr) => {
    const stepDataForSelectedStep = data?.[curr];

    if (stepDataForSelectedStep) {
      return {
        ...stepDataForSelectedStep,
        ...acc,
      };
    }

    return acc;
  }, {} as FlattenedRegistrationFormData);
};

export const incrementRegistrationStep = (step: number): number => {
  return step + 1;
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
