import { useStep } from 'src/hooks/queryParams/useStep';

export function useOnboardingStep() {
  const step = useStep();

  if (!step) {
    throw new Error('No onboarding step');
  }

  return step;
}
