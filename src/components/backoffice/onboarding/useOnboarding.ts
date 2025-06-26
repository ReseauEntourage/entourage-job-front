import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RegistrableUserRoles, UserRoles } from 'src/constants/users';
import { selectAuthenticatedUser } from 'src/use-cases/current-user';
import { generateProfileFromCVSelectors } from 'src/use-cases/cv';
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
} from 'src/use-cases/onboarding/onboarding.utils';
import { OnboardingFormData } from './Onboarding.types';

export const useOnboarding = () => {
  const dispatch = useDispatch();

  const currentStep = useSelector(selectOnboardingCurrentStep);
  const isOnboardingLoading = useSelector(selectIsOnboardingLoading);
  const stepData = useSelector(selectOnboardingCurrentStepData);
  const stepContent = useSelector(selectOnboardingCurrentStepContent);
  const valuesFromOtherStep = useSelector(selectOnboardingDataFromOtherStep);
  const authenticatedUser = useSelector(selectAuthenticatedUser);
  const shouldLaunchOnboarding = useSelector(selectShouldLaunchOnboarding);

  // Vérifier si la génération du profil AI est en cours
  const isGeneratingProfile = useSelector(
    generateProfileFromCVSelectors.selectIsGenerateProfileFromCVRequested
  );

  // Désactiver les boutons si on génère le profil ou si l'onboarding est en chargement
  const disableNavigationButtons = useMemo(
    () => isGeneratingProfile || isOnboardingLoading,
    [isGeneratingProfile, isOnboardingLoading]
  );

  const isFirstOnboardingStep = useMemo(() => {
    const firstStep = findNextNotSkippableStep(0, authenticatedUser);
    return currentStep === firstStep;
  }, [authenticatedUser, currentStep]);

  useEffect(() => {
    const hasAcceptedEthicsCharter = authenticatedUser?.readDocuments?.some(
      (doc) => doc.documentName === 'CharteEthique'
    );
    const userRoleHasOnboarding =
      authenticatedUser?.role === UserRoles.CANDIDATE ||
      authenticatedUser?.role === UserRoles.COACH;

    if (!hasAcceptedEthicsCharter && userRoleHasOnboarding) {
      dispatch(
        onboardingActions.launchOnboarding(
          authenticatedUser.role as RegistrableUserRoles
        )
      );
    } else {
      dispatch(onboardingActions.endOnboarding());
    }
  }, [authenticatedUser?.readDocuments, authenticatedUser.role, dispatch]);

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
    shouldLaunchOnboarding,
    disableNavigationButtons,
  };
};
