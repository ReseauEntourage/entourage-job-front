import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  onboardingActions,
  selectIsFirstOnboardingStep,
  selectIsLastOnboardingStep,
  selectOnboardingCurrentStepContent,
  selectOnboardingCurrentStepData,
  selectOnboardingNextStep,
} from 'src/use-cases/onboarding';
import { useOnboardingStep } from './useOnboardingStep';

export function useOnboarding() {
  const dispatch = useDispatch();

  const currentStep = useOnboardingStep();

  useEffect(() => {
    dispatch(onboardingActions.setOnboardingStep(currentStep));
  }, [dispatch, currentStep]);

  const pageData = useSelector(selectOnboardingCurrentStepData);
  const pageContent = useSelector(selectOnboardingCurrentStepContent);
  const isFirstOnboardingStep = useSelector(selectIsFirstOnboardingStep);
  const isLastOnboardingStep = useSelector(selectIsLastOnboardingStep);
  const nextStep = useSelector(selectOnboardingNextStep);

  return {
    pageContent,
    pageData,
    isFirstOnboardingStep,
    isLastOnboardingStep,
    nextStep,
  };
}
