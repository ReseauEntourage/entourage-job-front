import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { H2, H4 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import { GA_TAGS } from '@/src/constants/tags';
import { ImageGradientCard } from '@/src/features/partials/utils/ImageGradientCard';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledCardsGrid,
  StyledCoachFormatHighlights,
  StyledCTAContainer,
} from './CoachFormatHighlights.styles';

interface Highlight {
  title: React.ReactNode;
  description: React.ReactNode;
  img: string;
  alt: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    title: 'Rejoindre une communauté de citoyens bénévoles',
    description:
      'Et donner des coups de pouce concrets dans leur recherche d’emploi à des personnes isolées et précaires',
    img: '/static/img/front-office/aider/coach-ressources.jpg',
    alt: 'Un groupe de coachs et candidats réunis autour d’une table',
  },
  {
    title: 'Donner du sens à son expérience pro',
    description:
      'Et vivre des rencontres que vous n’auriez peut-être jamais faites autrement',
    img: '/static/img/why-become-coach.jpg',
    alt: 'Une coach échangeant avec un candidat, carnet de notes en main',
  },
  {
    title: 'Participer à des événements et à des ateliers thématiques',
    description:
      'Grâce au soutien de la communauté Entourage Pro et à la disponibilité de nos équipes',
    img: '/static/img/aider-coach.jpg',
    alt: 'Un échange entre un candidat et une coach, entourés d’autres participants',
  },
  {
    title: 'S’engager selon ses disponibilités',
    description: 'Sans pression de durée ni de fréquence, partout en France',
    img: '/static/img/dashboard-bao-coach-1.jpg',
    alt: 'Une coach et un candidat discutant face à face',
  },
];

export const CoachFormatHighlights = () => {
  return (
    <Section>
      <StyledCoachFormatHighlights>
        <H2
          title="C’est quoi être coach Entourage Pro ?"
          weight="bold"
          color={COLORS.primaryBlue}
          center
          noMarginBottom
        />
        <H4 title="Une rencontre humaine avant tout." weight="normal" center />

        <StyledCardsGrid>
          {HIGHLIGHTS.map((highlight, index) => (
            <ImageGradientCard
              key={index}
              title={highlight.title}
              description={highlight.description}
              img={highlight.img}
              alt={highlight.alt}
            />
          ))}
        </StyledCardsGrid>

        <StyledCTAContainer>
          <Button
            variant="primary"
            rounded
            size="large"
            weight="bold"
            href="/wizard"
            onClick={() => gaEvent(GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC)}
          >
            Je deviens coach
          </Button>
        </StyledCTAContainer>
      </StyledCoachFormatHighlights>
    </Section>
  );
};
