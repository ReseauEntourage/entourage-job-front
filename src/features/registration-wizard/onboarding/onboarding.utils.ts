import { WizardStep } from '@/src/features/wizard-shell/wizard.types';

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

// computeTotalDuration - Computes the total duration of all onboarding steps.
export const computeTotalDuration = (onboardingSteps: WizardStep[]) => {
  return onboardingSteps
    .reduce((total, step) => {
      const durationMatch = step.summary.duration.match(
        /~(\d+)(-(\d+))? minute/
      );
      if (durationMatch) {
        const min = parseInt(durationMatch[1], 10);
        const max = durationMatch[3] ? parseInt(durationMatch[3], 10) : min;
        return total + (min + max) / 2;
      }
      return total;
    }, 0)
    .toFixed(0);
};
