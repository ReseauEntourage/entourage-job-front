import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section, Button, Text, Alert } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { OnboardingLoading } from '@/src/features/backoffice/onboarding/onboarding-loading/OnboardingLoading';
import { StepsIndicator } from '@/src/features/backoffice/onboarding/steps-indicator/StepsIndicator';
import { StepsProgressBar } from '@/src/features/backoffice/onboarding/steps-progress-bar/StepsProgressBar';
import { useOnboarding } from '@/src/features/backoffice/onboarding/useOnboarding';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';

const OnboardingRun = () => {
  const {
    formErrorMessage,
    currentOnboardingStep,
    currentOnboardingStepContent,
    nextStepAllowed,
    incrementStep,
    isLoading,
  } = useOnboarding();

  return (
    <LayoutBackOffice title="Bien démarrer">
      <Section className="custom-page">
        <StepsProgressBar />
      </Section>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StepsIndicator />
          <br />
          {currentOnboardingStep ? (
            <>
              <HeaderBackoffice
                title={currentOnboardingStep.title}
                description={currentOnboardingStep.description}
              />
              {formErrorMessage && (
                <Alert variant="error">
                  <Text color="white">{formErrorMessage}</Text>
                </Alert>
              )}
              {currentOnboardingStepContent}
              <Button
                onClick={incrementStep}
                disabled={!nextStepAllowed || isLoading}
              >
                {isLoading && (
                  <>
                    <Spinner size={16} color="white" />
                    &nbsp;&nbsp;Chargement...
                  </>
                )}
                {!isLoading && 'Étape suivante'}
              </Button>
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
