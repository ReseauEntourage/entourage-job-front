import { useRouter } from 'next/router';
import { OnboardingStep } from 'src/components/onboarding/Onboarding/Onboarding.types';

export function useStep() {
  const {
    query: { step },
  } = useRouter();

  return step as OnboardingStep;
}
