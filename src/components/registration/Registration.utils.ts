import { NormalUserRole } from 'src/constants/users';
import {
  FlattenedStepData,
  RegistrationStep,
  RegistrationStepData,
} from './Registration.types';

export const flattenRegistrationData = (
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
  }, {} as FlattenedStepData);
};
