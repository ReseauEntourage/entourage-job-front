import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStep } from 'src/hooks/queryParams/useStep';
import {
  selectIsEmptyOnboardingData,
  selectIsFirstOnboardingStep,
} from 'src/use-cases/onboarding';
import { OnboardingSteps } from './Onboarding.types';

export function useRedirectToFirstStep() {
  const isEmptyOnboardingData = useSelector(selectIsEmptyOnboardingData);
  const isFirstOnboardingStep = useSelector(selectIsFirstOnboardingStep);

  const step = useStep();

  const { replace } = useRouter();

  useEffect(() => {
    if (!step || (isEmptyOnboardingData && !isFirstOnboardingStep)) {
      replace(`/inscription/${OnboardingSteps.FIRST}`);
    }
  }, [isEmptyOnboardingData, isFirstOnboardingStep, replace, step]);
}
