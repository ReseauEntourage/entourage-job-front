import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Text, Section, Button } from '@/src/components/ui';
import { StepsProgressBar } from '@/src/features/backoffice/onboarding/steps-progress-bar/StepsProgressBar';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { useOnboarding } from '@/src/hooks/useOnboarding';

const OnboardingRun = () => {
  const {
    currentOnboardingStep,
    currentOnboardingStepContent,
    currentOnboardingIdx,
    onboardingSteps,
    nextStepAllowed,
    incrementStep,
  } = useOnboarding();

  return (
    <LayoutBackOffice title="Bien démarrer">
      <Section className="custom-page">
        <StepsProgressBar />
      </Section>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <Text size="large">
            Etape&nbsp;{currentOnboardingIdx + 1}/{onboardingSteps.length}
          </Text>
          <br />
          <HeaderBackoffice
            title={currentOnboardingStep.title}
            description={currentOnboardingStep.description}
          />
          {currentOnboardingStepContent}

          <Button onClick={incrementStep} disabled={!nextStepAllowed}>
            Étape suivante
          </Button>
        </Section>
      </StyledBackgroundedHeaderBackoffice>
    </LayoutBackOffice>
  );
};

export default OnboardingRun;
