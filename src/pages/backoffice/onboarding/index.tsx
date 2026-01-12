import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section } from '@/src/components/ui';
import { StepsSummary } from '@/src/features/backoffice/onboarding/steps-summary/StepsSummary';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';

const OnboardingHome = () => {
  return (
    <LayoutBackOffice title="Bien démarrer">
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <HeaderBackoffice
            title="Bienvenue dans la communauté Entourage Pro"
            description="Prêt à faire vos premiers pas ? On vous a préparé une petite formation avant de vous lancer !"
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
