import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RegistrableUserRole } from 'src/constants/users';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
import {
  onboardingActions,
  selectIsOnboardingLoading,
  selectOnboardingCurrentStep,
  selectOnboardingCurrentStepContent,
  selectOnboardingCurrentStepData,
  selectOnboardingDataFromOtherStep,
} from 'src/use-cases/onboarding';
import {
  findNextNotSkippableStep,
  findPreviousNotSkippableStep,
} from 'src/use-cases/onboarding/onboarding.utils';
import {
  onboardingAlreadyCompleted,
  OnboardingFormData,
} from './Onboarding.types';

export const useOnboarding = () => {
  const dispatch = useDispatch();

  const currentStep = useSelector(selectOnboardingCurrentStep);
  const isOnboardingLoading = useSelector(selectIsOnboardingLoading);
  const stepData = useSelector(selectOnboardingCurrentStepData);
  const stepContent = useSelector(selectOnboardingCurrentStepContent);
  const valuesFromOtherStep = useSelector(selectOnboardingDataFromOtherStep);
  const authenticatedUser = useSelector(selectAuthenticatedUser);

  const isFirstOnboardingStep = useMemo(() => {
    const firstStep = findNextNotSkippableStep(0, authenticatedUser);
    return currentStep === firstStep;
  }, [authenticatedUser, currentStep]);

  useEffect(() => {
    // If user is not an admin, launch onboarding
    const hasAllRequiredFields =
      onboardingAlreadyCompleted[authenticatedUser.role](authenticatedUser);
    if (
      authenticatedUser?.role &&
      ['Candidat', 'Coach'].includes(authenticatedUser.role) &&
      !hasAllRequiredFields
    ) {
      dispatch(
        onboardingActions.launchOnboarding(
          authenticatedUser.role as RegistrableUserRole
        )
      );
    } else {
      dispatch(onboardingActions.endOnboarding());
    }
  }, [dispatch, authenticatedUser]);

  const onSubmitStepForm = useCallback(
    (fields: OnboardingFormData) => {
      const fieldsKeys = Object.keys(fields);
      let onboardingFields = fields;

      if (valuesFromOtherStep) {
        onboardingFields = fieldsKeys.reduce((acc, curr) => {
          if (!Object.keys(valuesFromOtherStep).includes(curr)) {
            return {
              ...acc,
              [curr]: fields[curr],
            };
          }
          return acc;
        }, {} as OnboardingFormData);
      }

      dispatch(
        onboardingActions.setOnboardingCurrentStepData(onboardingFields)
      );
    },
    [dispatch, valuesFromOtherStep]
  );

  const onBeforeStep = useCallback(() => {
    const previousStep = findPreviousNotSkippableStep(
      currentStep,
      authenticatedUser
    );
    if (previousStep !== currentStep) {
      dispatch(onboardingActions.setOnboardingStep(previousStep));
    }
  }, [authenticatedUser, currentStep, dispatch]);

  const defaultValues = {
    ...valuesFromOtherStep,
    ...(stepContent?.defaultValues?.(authenticatedUser) || {}),
  };

  return {
    currentStep,
    onBeforeStep,
    isOnboardingLoading,
    stepContent,
    stepData,
    defaultValues,
    isFirstOnboardingStep,
    onSubmitStepForm,
  };
};
