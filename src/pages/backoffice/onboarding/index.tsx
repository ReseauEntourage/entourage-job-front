import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section } from '@/src/components/ui';
import { StepsSummary } from '@/src/features/backoffice/onboarding/summary/StepsSummary/StepsSummary';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';

const OnboardingHome = () => {
  return (
    <LayoutBackOffice title="Bien démarrer">
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <HeaderBackoffice
            title="Bienvenue dans la communauté Entourage Pro"
            description="Merci d’avoir rejoins la communauté. Pour vous accompagner au mieux dans vos premier pas et vous aider à tirer le meilleur parti de notre réseau, nous avons préparé quelques ressources et conseils."
            noSeparator
          />
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StepsSummary />
      </Section>
    </LayoutBackOffice>
  );
};

export default OnboardingHome;
