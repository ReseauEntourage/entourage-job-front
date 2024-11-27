import {
  FlattenedReferingFormData,
  ReferingStep,
  ReferingStepData,
} from './Refering.types';

export const incrementReferingStep = (step: ReferingStep): ReferingStep => {
  const stepNumber: number = parseInt(step.split('-')[1], 10);
  return `step-${stepNumber + 1}`;
};

export const flattenReferingData = (
  data: ReferingStepData
): FlattenedReferingFormData => {
  const allSteps: ReferingStep[] = Object.keys(data) as ReferingStep[];

  return allSteps.reduce((acc, curr) => {
    const stepData = data[curr];

    if (stepData) {
      return {
        ...stepData,
        ...acc,
      };
    }

    return acc;
  }, {} as FlattenedReferingFormData);
};
