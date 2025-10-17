import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@/src/api';
import { CompanyDto } from '@/src/api/types';
import { useProfileGeneration } from '@/src/hooks';
import { notificationsActions } from '@/src/use-cases/notifications';
import { ExtractFormSchemaValidation } from '../../forms/FormSchema';
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
import { CREATE_NEW_COMPANY_VALUE } from './Onboarding/forms/schemas/formOnboardingCoachJob';
import {
  OnboardingFormData,
  OnboardingFormWithCompanyField,
} from './Onboarding.types';

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

  const handleCompanyFields = useCallback(
    async (fields: OnboardingFormData) => {
      const fieldsWithCompany =
        fields as ExtractFormSchemaValidation<OnboardingFormWithCompanyField>;
      const shouldTryToCreateCompany =
        fieldsWithCompany.companyId.value === CREATE_NEW_COMPANY_VALUE;

      // Create company if needed
      if (shouldTryToCreateCompany) {
        let { companyName } = fieldsWithCompany;
        const companyFields = {
          name: companyName,
        } as CompanyDto;

        let newCompanyId: string;
        try {
          ({
            data: { id: newCompanyId, name: companyName },
          } = await Api.postCompany(companyFields));

          // Update companyId field with the new company id
          fieldsWithCompany.companyId = {
            label: companyName as string,
            value: newCompanyId,
          };
        } catch (error) {
          console.error(error);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de la création de l'entreprise",
            })
          );
        }
      }
    },
    [dispatch]
  );

  const onSubmitStepForm = useCallback(
    async (fields: OnboardingFormData) => {
      const fieldsKeys = Object.keys(fields);
      let onboardingFields = fields;

      // Handle companyId field
      if (fieldsKeys.includes('companyId')) {
        await handleCompanyFields(fields);
      }

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
    [dispatch, handleCompanyFields, valuesFromOtherStep]
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
