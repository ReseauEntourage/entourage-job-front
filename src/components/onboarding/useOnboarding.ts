import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import {
  onboardingActions,
  selectIsFirstOnboardingStep,
  selectIsLastOnboardingStep,
  selectIsOnboardingLoading,
  selectOnboardingCurrentStepContent,
  selectOnboardingCurrentStepData,
  selectOnboardingNextStep,
} from 'src/use-cases/onboarding';
import { OnboardingForms } from './Onboarding/Onboarding.types';
import { useOnboardingStep } from './useOnboardingStep';

export function useOnboarding() {
  const { push, back } = useRouter();
  const dispatch = useDispatch();

  const currentStep = useOnboardingStep();

  useEffect(() => {
    dispatch(onboardingActions.setOnboardingStep(currentStep));
  }, [dispatch, currentStep]);

  const isOnboardingLoading = useSelector(selectIsOnboardingLoading);

  const pageData = useSelector(selectOnboardingCurrentStepData);
  const pageContent = useSelector(selectOnboardingCurrentStepContent);
  const isFirstOnboardingStep = useSelector(selectIsFirstOnboardingStep);
  const isLastOnboardingStep = useSelector(selectIsLastOnboardingStep);
  const nextStep = useSelector(selectOnboardingNextStep);

  const isLoading = isOnboardingLoading;

  const onSubmitStepForm = useCallback(
    (fields: ExtractFormSchemaValidation<OnboardingForms>) => {
      dispatch(onboardingActions.setOnboardingCurrentStepData(fields));
      if (!isLastOnboardingStep) {
        push(`/inscription/${nextStep}`, undefined, {
          shallow: true,
        });
      }
    },
    [dispatch, isLastOnboardingStep, nextStep, push]
  );

  const onBack = useCallback(back, [back]);

  return {
    isLoading,
    pageContent,
    pageData,
    isFirstOnboardingStep,
    onSubmitStepForm,
    onBack,
  };
}
