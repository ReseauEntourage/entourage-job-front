import { CompanyOnboardingStepContents } from '@/src/features/backoffice/onboardingLegacy/Onboarding/stepContent';
import {
  FlattenedOnboardingFormData,
  ONBOARDING_FIRST_STEP,
  OnboardingFlow,
  OnboardingStep,
  OnboardingStepContent,
  OnboardingStepData,
} from '@/src/features/backoffice/onboardingLegacy/Onboarding.types';
import { CurrentUserCompany, ReadDocumentItem, User } from 'src/api/types';

type OnboardingSkipContext = {
  readDocuments: ReadDocumentItem[];
  company: CurrentUserCompany | null;
};

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

const shouldSkipStepOnboardingStep = (
  stepContent: OnboardingStepContent,
  user: User,
  context: OnboardingSkipContext
) => {
  if (!stepContent.skippedBy) {
    return false;
  }
  return stepContent.skippedBy(user, context);
};

export const getOnboardingStepContent = (flow: OnboardingFlow) => {
  switch (flow) {
    case OnboardingFlow.COMPANY:
      return CompanyOnboardingStepContents;
    default:
      throw new Error(`Unknown onboarding flow: ${flow}`);
  }
};

export const findPreviousNotSkippableStep = (
  currentStep: OnboardingStep,
  user: User,
  flow: OnboardingFlow,
  context: OnboardingSkipContext = { readDocuments: [], company: null }
): OnboardingStep => {
  let prevStep = currentStep;
  while (prevStep > ONBOARDING_FIRST_STEP) {
    prevStep = (prevStep - 1) as OnboardingStep;

    const flowContent = getOnboardingStepContent(flow);
    const prevStepContent = flowContent[prevStep];

    if (
      prevStepContent &&
      !shouldSkipStepOnboardingStep(prevStepContent, user, context)
    ) {
      return prevStep;
    }
  }
  return currentStep;
};

const getLastOnboardingStep = (flow: OnboardingFlow): OnboardingStep => {
  const content = getOnboardingStepContent(flow);
  return Math.max(
    ...Object.keys(content).map((step) => parseInt(step, 10))
  ) as OnboardingStep;
};

export const findNextNotSkippableStep = (
  currentStep: OnboardingStep,
  user: User,
  flow: OnboardingFlow,
  context: OnboardingSkipContext = { readDocuments: [], company: null }
): OnboardingStep => {
  let nextStep = currentStep;

  const lastStep = getLastOnboardingStep(flow);

  while (nextStep < lastStep) {
    nextStep = (nextStep + 1) as OnboardingStep;

    const flowContent = getOnboardingStepContent(flow);
    const nextStepContent = flowContent[nextStep];

    if (
      nextStepContent &&
      !shouldSkipStepOnboardingStep(nextStepContent, user, context)
    ) {
      return nextStep;
    }
  }
  return currentStep;
};

export const getOnboardingFlow = (
  company: CurrentUserCompany | null
): OnboardingFlow | null => {
  if (company && company.companyUser?.isAdmin) {
    return OnboardingFlow.COMPANY;
  }
  return null;
};
