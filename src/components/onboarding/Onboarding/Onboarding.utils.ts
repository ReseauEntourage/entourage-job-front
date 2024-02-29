import { OnboardingStep } from './Onboarding.types';

export function incrementOnboardingStep(
  currentStep: OnboardingStep
): OnboardingStep {
  const currentStepNumber: number = parseInt(currentStep.split('-')[1], 10);
  return `step-${currentStepNumber + 1}`;
}
