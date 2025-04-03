import { User, UserProfile } from 'src/api/types';
import {
  FlattenedOnboardingFormData,
  ONBOARDING_FIRST_STEP,
  ONBOARDING_LAST_STEP,
  OnboardingStep,
  OnboardingStepContent,
  OnboardingStepContents,
  OnboardingStepData,
} from 'src/components/backoffice/onboarding/Onboarding.types';
import { RegistrableUserRole } from 'src/constants/users';

export const flattenOnboardingDataByRole = (
  data: OnboardingStepData,
  selectedRole: RegistrableUserRole
): FlattenedOnboardingFormData => {
  const allSteps: OnboardingStep[] = Object.keys(data).map(
    (key) => Number(key) as OnboardingStep
  );

  return allSteps.reduce((acc, curr) => {
    const stepDataForSelectedRole = data[curr]?.[selectedRole];

    if (stepDataForSelectedRole) {
      return {
        ...stepDataForSelectedRole,
        ...acc,
      };
    }

    return acc;
  }, {} as FlattenedOnboardingFormData);
};

export const increaseOnboardingStep = (
  step: OnboardingStep
): OnboardingStep => {
  return (step + 1) as OnboardingStep;
};

export const shouldSkipStepOnboardingStep = (
  stepContent: OnboardingStepContent,
  user: User
) => {
  if (!stepContent.skippedBy) {
    return false;
  }
  return stepContent?.skippedBy(user);
};

export const parseOnboadingProfileFields = (
  fields: Partial<FlattenedOnboardingFormData>
): Partial<UserProfile> & {
  businessSectorIds?: string[];
} => {
  return {
    description: fields.description ?? undefined,
    linkedinUrl: fields.linkedinUrl ?? undefined,
    currentJob: fields.currentJob ? fields.currentJob : undefined,
    businessSectorIds:
      fields.businessSectorIds?.map(
        (businessSectorIds) => businessSectorIds.value
      ) ?? undefined,
  };
};

export const findPreviousNotSkippableStep = (
  currentStep: OnboardingStep,
  user: User
): OnboardingStep => {
  let prevStep = currentStep;
  while (prevStep > ONBOARDING_FIRST_STEP) {
    prevStep = (prevStep - 1) as OnboardingStep;
    const prevStepContent = OnboardingStepContents?.[prevStep]?.[user.role];
    if (!shouldSkipStepOnboardingStep(prevStepContent, user)) {
      return prevStep;
    }
  }
  return currentStep; // if no next step, return current step
};

export const findNextNotSkippableStep = (
  currentStep: OnboardingStep,
  user: User
): OnboardingStep => {
  let nextStep = currentStep;
  while (nextStep < ONBOARDING_LAST_STEP[user.role]) {
    nextStep = (nextStep + 1) as OnboardingStep;
    const nextStepContent = OnboardingStepContents?.[nextStep]?.[user.role];
    if (!shouldSkipStepOnboardingStep(nextStepContent, user)) {
      return nextStep;
    }
  }
  return currentStep; // if no next step, return current step
};
