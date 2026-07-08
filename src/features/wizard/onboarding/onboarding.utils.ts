import { WizardStep } from '@/src/features/wizard/shell/wizard.types';

// determineStartingStep - Determines the starting onboarding step based on user data.
export const determineStartingStep = async (
  onboardingSteps: WizardStep[]
): Promise<number | null> => {
  for (let i = 0; i < onboardingSteps.length; i++) {
    const step = onboardingSteps[i];
    if (step.isStepCompleted) {
      const completed = await step.isStepCompleted();
      if (!completed) {
        return i;
      }
    } else {
      return i;
    }
  }
  // null = toutes les étapes sont déjà complètes
  return null;
};
