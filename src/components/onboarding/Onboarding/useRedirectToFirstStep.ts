import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStep } from 'src/hooks/queryParams/useStep';
import { selectIsEmptyOnboardingData } from 'src/use-cases/onboarding';
import { firstOnboardingStep } from './Onboarding.types';

export function useRedirectToFirstStep() {
  const isEmptyOnboardingData = useSelector(selectIsEmptyOnboardingData);
  const step = useStep();

  const { replace } = useRouter();

  useEffect(() => {
    if (!step || (isEmptyOnboardingData && step !== firstOnboardingStep)) {
      replace(`/inscription/${firstOnboardingStep}`);
    }
  }, [isEmptyOnboardingData, replace, step]);
}
