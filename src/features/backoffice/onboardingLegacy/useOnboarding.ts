import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileGeneration } from '@/src/hooks';
import {
  onboardingActions,
  selectIsOnboardingLoading,
  selectOnboardingCurrentStep,
  selectOnboardingCurrentStepContent,
  selectOnboardingCurrentStepData,
  selectOnboardingDataFromOtherStep,
  selectShouldLaunchOnboarding,
} from '@/src/use-cases/onboardingOld';
import {
  findNextNotSkippableStep,
  findPreviousNotSkippableStep,
  getOnboardingFlow,
} from '@/src/use-cases/onboardingOld/onboarding.utils';
import { UserRoles } from 'src/constants/users';
import { useCurrentUserCompany } from 'src/hooks/current-user/useCurrentUserCompany';
import { useCurrentUserReadDocuments } from 'src/hooks/current-user/useCurrentUserReadDocuments';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
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
  const company = useCurrentUserCompany();
  const readDocuments = useCurrentUserReadDocuments();

  // Désactiver les boutons si on génère le profil ou si l'onboarding est en chargement
  const disableNavigationButtons = useMemo(
    () => isGeneratingProfile || isOnboardingLoading,
    [isGeneratingProfile, isOnboardingLoading]
  );

  const isFirstOnboardingStep = useMemo(() => {
    const flow = getOnboardingFlow(company);

    if (!flow) {
      return false;
    }
    const context = { readDocuments: readDocuments ?? [], company };
    const firstStep = findNextNotSkippableStep(
      0,
      authenticatedUser,
      flow,
      context
    );
    return currentStep === firstStep;
  }, [authenticatedUser, company, currentStep, readDocuments]);

  useEffect(() => {
    const hasAcceptedEthicsCharter =
      authenticatedUser &&
      readDocuments?.some((doc) => doc.documentName === 'CharteEthique');
    const userRoleHasOnboarding = authenticatedUser?.role === UserRoles.COACH;

    // Ne relance pas l'onboarding s'il est déjà en cours
    if (
      !hasAcceptedEthicsCharter &&
      userRoleHasOnboarding &&
      currentStep === 0
    ) {
      const flow = getOnboardingFlow(company);

      if (!flow) {
        return;
      }
      dispatch(onboardingActions.launchOnboarding(flow));
    } else if (hasAcceptedEthicsCharter || !userRoleHasOnboarding) {
      dispatch(onboardingActions.endOnboarding());
    }
  }, [
    authenticatedUser,
    readDocuments,
    authenticatedUser.role,
    dispatch,
    currentStep,
    company,
  ]);

  const onSubmitStepForm = useCallback(
    async (fields: OnboardingFormData) => {
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
    const flow = getOnboardingFlow(company);

    if (!flow) {
      return;
    }
    const context = { readDocuments: readDocuments ?? [], company };
    const previousStep = findPreviousNotSkippableStep(
      currentStep,
      authenticatedUser,
      flow,
      context
    );
    if (previousStep !== currentStep) {
      dispatch(onboardingActions.setOnboardingStep(previousStep));
    }
  }, [authenticatedUser, company, currentStep, dispatch, readDocuments]);

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
