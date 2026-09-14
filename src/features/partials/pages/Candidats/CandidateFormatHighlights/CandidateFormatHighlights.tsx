import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { H2, H4 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { ImageGradientCard } from '@/src/features/partials/utils/ImageGradientCard';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledCandidatsGrid,
  StyledCTAContainer,
  StyledCandidateFormatHighlights,
} from './CandidateFormatHighlights.styles';

interface Highlight {
  title: React.ReactNode;
  description: React.ReactNode;
  img: string;
  alt: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'Rejoindre un réseau professionnel solidaire',
    description:
      'Pour faire des rencontres pro et profiter du soutien de coachs bénévoles.',
    img: '/static/img/front-office/candidat/format-highlight-1.jpg',
    alt: 'Un groupe de coachs et candidats réunis autour d’une table',
  },
  {
    title: 'Participer à des évènements et ateliers collectifs réguliers',
    description:
      'Pour rencontrer des coachs et des candidats, et monter en compétence sur votre recherche d’emploi.',
    img: '/static/img/front-office/candidat/format-highlight-2.jpg',
    alt: 'Une coach échangeant avec un candidat, carnet de notes en main',
  },
  {
    title: 'Être écouté et retrouver confiance en soi',
    description:
      'Grâce au soutien de la communauté Entourage Pro et à la disponibilité de nos équipes.',
    img: '/static/img/front-office/candidat/format-highlight-3.jpg',
    alt: 'Un échange entre un candidat et une coach, entourés d’autres participants',
  },
  {
    title: 'S’engager selon ses contraintes et son rythme',
    description:
      'Sans pression de durée ni de fréquence, partout en France, en ligne ou en présentiel.',
    img: '/static/img/front-office/candidat/format-highlight-4.jpg',
    alt: 'Une coach et un candidat discutant face à face',
  },
];

export const CandidateFormatHighlights = () => {
  return (
    <Section>
      <StyledCandidateFormatHighlights>
        <H2
          title="C’est quoi être candidat Entourage Pro ?"
          weight="bold"
          color={COLORS.primaryBlue}
          center
          noMarginBottom
        />
        <H4
          title="Être soutenu dans son retour à l’emploi via un réseau professionnel solidaire."
          weight="normal"
          center
        />

        <StyledCandidatsGrid>
          {HIGHLIGHTS.map((highlight, index) => (
            <ImageGradientCard
              key={index}
              title={highlight.title}
              description={highlight.description}
              img={highlight.img}
              alt={highlight.alt}
            />
          ))}
        </StyledCandidatsGrid>

        <StyledCTAContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            weight="bold"
            href="/wizard"
            onClick={() => gaEvent(GA_TAGS.PAGE_TRAVAILLER_INSCRIPTION_CLICK)}
          >
            Je deviens candidat
          </Button>
        </StyledCTAContainer>
      </StyledCandidateFormatHighlights>
    </Section>
  );
};
