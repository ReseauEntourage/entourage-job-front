import {
  CandidateOnboardingStepContents,
  CoachOnboardingStepContents,
  CompanyOnboardingStepContents,
} from '@/src/components/backoffice/onboarding/Onboarding/stepContent';
import { UserRoles } from '@/src/constants/users';
import { isRoleIncluded } from '@/src/utils';
import {
  Nudge,
  User,
  UserProfile,
  UserProfileSectorOccupation,
} from 'src/api/types';
import {
  FlattenedOnboardingFormData,
  ONBOARDING_FIRST_STEP,
  ONBOARDING_LAST_STEP,
  OnboardingFlow,
  OnboardingStep,
  OnboardingStepContent,
  OnboardingStepData,
} from 'src/components/backoffice/onboarding/Onboarding.types';

export const flattenOnboardingDataByFlow = (
  data: OnboardingStepData,
  selectedFlow: OnboardingFlow
): FlattenedOnboardingFormData => {
  const allSteps: OnboardingStep[] = Object.keys(data).map(
    (key) => Number(key) as OnboardingStep
  );

  return allSteps.reduce((acc, curr) => {
    const stepDataForSelectedFlow = data[curr]?.[selectedFlow];

    if (stepDataForSelectedFlow) {
      return {
        ...stepDataForSelectedFlow,
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
): Partial<UserProfile> => {
  return {
    introduction: fields.introduction ?? undefined,
    linkedinUrl: fields.linkedinUrl ?? undefined,
    currentJob: fields.currentJob ? fields.currentJob : undefined,
    sectorOccupations:
      fields.businessSectorIds?.map((businessSectorId, idx) => {
        return {
          businessSectorId: businessSectorId.value,
          order: idx,
        } as UserProfileSectorOccupation;
      }) ?? undefined,
    nudges:
      fields.nudgeIds?.map((nudgeId) => {
        return {
          id: nudgeId,
        } as Nudge;
      }) ?? undefined,
  };
};

export const getOnboardingStepContent = (flow: OnboardingFlow) => {
  switch (flow) {
    case OnboardingFlow.CANDIDATE:
      return CandidateOnboardingStepContents;
    case OnboardingFlow.COACH:
      return CoachOnboardingStepContents;
    case OnboardingFlow.COMPANY:
      return CompanyOnboardingStepContents;
    default:
      throw new Error(`Unknown onboarding flow: ${flow}`);
  }
};

export const findPreviousNotSkippableStep = (
  currentStep: OnboardingStep,
  user: User,
  flow: OnboardingFlow
): OnboardingStep => {
  let prevStep = currentStep;
  while (prevStep > ONBOARDING_FIRST_STEP) {
    prevStep = (prevStep - 1) as OnboardingStep;

    const flowContent = getOnboardingStepContent(flow);
    const prevStepContent = flowContent[prevStep];

    if (
      prevStepContent &&
      !shouldSkipStepOnboardingStep(prevStepContent, user)
    ) {
      return prevStep;
    }
  }
  return currentStep; // if no next step, return current step
};

export const findNextNotSkippableStep = (
  currentStep: OnboardingStep,
  user: User,
  flow: OnboardingFlow
): OnboardingStep => {
  let nextStep = currentStep;

  const lastStep = ONBOARDING_LAST_STEP[flow];

  while (nextStep < lastStep) {
    nextStep = (nextStep + 1) as OnboardingStep;

    const flowContent = getOnboardingStepContent(flow);
    const nextStepContent = flowContent[nextStep];

    if (
      nextStepContent &&
      !shouldSkipStepOnboardingStep(nextStepContent, user)
    ) {
      return nextStep;
    }
  }
  return currentStep; // if no next step, return current step
};

export const getOnboardingFlow = (user: User): OnboardingFlow => {
  if (isRoleIncluded(user.role, UserRoles.CANDIDATE)) {
    return OnboardingFlow.CANDIDATE;
  }
  if (user.OrganizationId) {
    return OnboardingFlow.COMPANY;
  }
  return OnboardingFlow.COACH;
};
