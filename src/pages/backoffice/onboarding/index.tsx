import React from 'react';
import { LayoutBackOffice } from '@/src/components/backoffice/LayoutBackOffice';
import { HeaderBackoffice } from '@/src/components/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Section, Text } from '@/src/components/utils';
import { H4 } from '@/src/components/utils/Headings';

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
        <H4 title="Votre parcours d'intégration : 5 étapes essentielles" />
        <Text>
          Un parcours structuré pour vous donner toutes les clés de réussite
          avant votre première session.
        </Text>
      </Section>
    </LayoutBackOffice>
  );
};

export default OnboardingHome;
