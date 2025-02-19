import React from 'react';
import {
  StyledOnboardingSpinnerContainer,
  StyledStepContainer,
} from '../Onboarding.styles';
import { useOnboarding } from '../useOnboarding';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Spinner } from 'src/components/utils/Spinner';

export const Onboarding = () => {
  const {
    isOnboardingLoading,
    stepContent,
    defaultValues,
    isFirstOnboardingStep,
    onSubmitStepForm,
    onBeforeStep,
    currentStep,
  } = useOnboarding();

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
              defaultValues={defaultValues}
              onSubmit={onSubmitStepForm}
              submitText="Suivant"
              cancelText="Précédent"
              {...(!isFirstOnboardingStep ? { onCancel: onBeforeStep } : {})}
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
