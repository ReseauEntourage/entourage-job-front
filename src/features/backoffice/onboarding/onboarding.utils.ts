import { OnboardingStep } from './onboarding.types';

// determineStartingStep - Determines the starting onboarding step based on user data.
export const determineStartingStep = async (
  onboardingSteps: OnboardingStep[]
) => {
  // For each step, check if it's completed; return the index of the first incomplete step.
  for (let i = 0; i < onboardingSteps.length; i++) {
    const step = onboardingSteps[i];
    if (step.isStepCompleted) {
      const completed = await step.isStepCompleted();
      if (!completed) {
        return i;
      }
    } else {
      // If no completion check is provided, assume the step is incomplete.
      return i;
    }
  }
  return 0; // Default to the first step if all are complete.
};

// computeTotalDuration - Computes the total duration of all onboarding steps.
export const computeTotalDuration = (onboardingSteps: OnboardingStep[]) => {
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
