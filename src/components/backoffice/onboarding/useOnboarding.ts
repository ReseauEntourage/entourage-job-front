import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileGeneration } from '@/src/hooks';
import { UserRoles } from 'src/constants/users';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
import {
  onboardingActions,
  selectIsOnboardingLoading,
  selectOnboardingCurrentStep,
  selectOnboardingCurrentStepContent,
  selectOnboardingCurrentStepData,
  selectOnboardingDataFromOtherStep,
  selectShouldLaunchOnboarding,
} from 'src/use-cases/onboarding';
import {
  findNextNotSkippableStep,
  findPreviousNotSkippableStep,
  getOnboardingFlow,
} from 'src/use-cases/onboarding/onboarding.utils';
import { OnboardingFormData } from './Onboarding.types';

export const useOnboarding = () => {
  const dispatch = useDispatch();
  const { isLoading: isGeneratingProfile } = useProfileGeneration();

  const currentStep = useSelector(selectOnboardingCurrentStep);
  const isOnboardingLoading = useSelector(selectIsOnboardingLoading);
  const stepData = useSelector(selectOnboardingCurrentStepData);
  const stepContent = useSelector(selectOnboardingCurrentStepContent);
  const valuesFromOtherStep = useSelector(selectOnboardingDataFromOtherStep);
  const authenticatedUser = useSelector(selectAuthenticatedUser);
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);

  // Désactiver les boutons si on génère le profil ou si l'onboarding est en chargement
  const disableNavigationButtons = useMemo(
    () => isGeneratingProfile || isOnboardingLoading,
    [isGeneratingProfile, isOnboardingLoading]
  );

  const isFirstOnboardingStep = useMemo(() => {
    // Determine onboarding flow based on user role
    const flow = getOnboardingFlow(authenticatedUser);

    const firstStep = findNextNotSkippableStep(0, authenticatedUser, flow);
    return currentStep === firstStep;
  }, [authenticatedUser, currentStep]);

  useEffect(() => {
    const hasAcceptedEthicsCharter =
      authenticatedUser &&
      authenticatedUser.readDocuments?.some(
        (doc) => doc.documentName === 'CharteEthique'
      );
    const userRoleHasOnboarding =
      authenticatedUser?.role === UserRoles.CANDIDATE ||
      authenticatedUser?.role === UserRoles.COACH;

    // Ne relance pas l'onboarding s'il est déjà en cours
    if (
      !hasAcceptedEthicsCharter &&
      userRoleHasOnboarding &&
      currentStep === 0
    ) {
      const flow = getOnboardingFlow(authenticatedUser);

      dispatch(onboardingActions.launchOnboarding(flow));
    } else if (hasAcceptedEthicsCharter || !userRoleHasOnboarding) {
      dispatch(onboardingActions.endOnboarding());
    }
  }, [
    authenticatedUser,
    authenticatedUser?.readDocuments,
    authenticatedUser.role,
    dispatch,
    currentStep,
  ]);

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
    const flow = getOnboardingFlow(authenticatedUser);

    const previousStep = findPreviousNotSkippableStep(
      currentStep,
      authenticatedUser,
      flow
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
    shouldLaunchOnboarding,
    disableNavigationButtons,
  };
};
