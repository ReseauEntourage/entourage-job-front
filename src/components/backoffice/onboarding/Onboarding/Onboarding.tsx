import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  StyledOnboardingSpinnerContainer,
  StyledStepContainer,
} from '../Onboarding.styles';
import { useOnboarding } from '../useOnboarding';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Spinner } from 'src/components/utils/Spinner';
import { generateProfileFromCVSelectors } from 'src/use-cases/cv';

export const Onboarding = () => {
  const {
    isOnboardingLoading,
    stepContent,
    defaultValues,
    isFirstOnboardingStep,
    onSubmitStepForm,
    onBeforeStep,
    currentStep,
    stepData,
  } = useOnboarding();

  // Vérifier si la génération du profil AI est en cours
  const isGeneratingProfile = useSelector(
    generateProfileFromCVSelectors.selectIsGenerateProfileFromCVRequested
  );

  // Désactiver les boutons si on génère le profil ou si l'onboarding est en chargement
  const disableButtons = useMemo(
    () => isGeneratingProfile || isOnboardingLoading,
    [isGeneratingProfile, isOnboardingLoading]
  );

  if (currentStep === 0) {
    return null;
  }

  return (
    <ModalGeneric
      title={stepContent?.title || ''}
      description={stepContent?.subtitle || ''}
      size="large"
      noCloseIcon
    >
      {!isOnboardingLoading && (
        <StyledStepContainer>
          {stepContent?.content}
          {stepContent?.form && (
            <FormWithValidation
              formSchema={stepContent.form}
              defaultValues={{
                ...(defaultValues || {}),
                ...(stepData || {}),
              }}
              onSubmit={onSubmitStepForm}
              submitText="Suivant"
              cancelText="Précédent"
              {...(!isFirstOnboardingStep ? { onCancel: onBeforeStep } : {})}
              disabled={disableButtons}
            />
          )}
        </StyledStepContainer>
      )}
      {isOnboardingLoading && (
        <StyledOnboardingSpinnerContainer>
          <Spinner />
        </StyledOnboardingSpinnerContainer>
      )}
    </ModalGeneric>
  );
};
