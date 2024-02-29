import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onboardingActions,
  selectOnboardingCurrentStepData,
} from 'src/use-cases/onboarding';
import { useOnboardingStep } from './useOnboardingStep';
import { useRedirectToFirstStep } from './useRedirectToFirstStep';

export function useOnboarding() {
  const dispatch = useDispatch();

  useRedirectToFirstStep();

  const currentStep = useOnboardingStep();

  useEffect(() => {
    dispatch(onboardingActions.setOnboardingStep(currentStep));
  }, [dispatch, currentStep]);

  const pageData = useSelector(selectOnboardingCurrentStepData);

  return { pageData, currentStep };
}
