import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section, Button, Alert } from '@/src/components/ui';
import { AlertVariant } from '@/src/components/ui/Alert/Alert.types';
import { Spinner } from '@/src/components/ui/Spinner';
import { OnboardingLoading } from '@/src/features/backoffice/onboarding/onboarding-loading/OnboardingLoading';
import { StyledOnboardingActions } from '@/src/features/backoffice/onboarding/onboarding.styles';
import { StepsIndicator } from '@/src/features/backoffice/onboarding/steps-indicator/StepsIndicator';
import { StepsProgressBar } from '@/src/features/backoffice/onboarding/steps-progress-bar/StepsProgressBar';
import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { useIsDev } from '@/src/hooks/useIsDev';

const OnboardingRun = () => {
  const {
    formErrorMessage,
    currentOnboardingStep,
    currentOnboardingStepContent,
    incrementationIsAllowed,
    incrementStep,
    isLoading,
    skipOnboarding,
  } = useOnboarding();

  const isDev = useIsDev();

  return (
    <LayoutBackOffice title="Bien démarrer">
      <Section className="custom-page">
        <StepsProgressBar />
      </Section>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StepsIndicator />
          <br />
          <br />
          {currentOnboardingStep ? (
            <>
              <HeaderBackoffice
                title={currentOnboardingStep.title}
                description={currentOnboardingStep.description}
              />
              {formErrorMessage && (
                <>
                  <Alert variant={AlertVariant.Error}>{formErrorMessage}</Alert>
                  <br />
                </>
              )}
              {currentOnboardingStepContent}
              <StyledOnboardingActions>
                <Button
                  onClick={incrementStep}
                  disabled={!incrementationIsAllowed || isLoading}
                  size="large"
                >
                  {isLoading && (
                    <>
                      <Spinner size={16} color="white" />
                      &nbsp;&nbsp;Chargement...
                    </>
                  )}
                  {!isLoading && 'Étape suivante'}
                </Button>
              </StyledOnboardingActions>
            </>
          ) : (
            <OnboardingLoading />
          )}
        </Section>
      </StyledBackgroundedHeaderBackoffice>
    </LayoutBackOffice>
  );
};

export default OnboardingRun;
