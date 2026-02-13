import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Button, Section, Text } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import {
  StyledSimpleIconCTACard,
  StyledSimpleIconCTACardsContent,
  StyledSimpleIconCTACardsGrid,
  StyledSimpleIconCTACardsGridBackground,
  StyledSimpleIconCTACardsGridSubtitle,
  StyledSimpleIconCTACardsTitle,
} from './SimpleIconCTACardsGrid.styles';

export interface SimpleIconCTACardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  CTAText: React.ReactNode;
  onClick?: () => void;
  href?: string;
}

export interface SimpleIconCTACardsGridProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  cards: SimpleIconCTACardProps[];
}

export const SimpleIconCTACardsGrid = ({
  title,
  subtitle,
  cards,
}: SimpleIconCTACardsGridProps) => {
  return (
    <StyledSimpleIconCTACardsGridBackground>
      <Section>
        <H3 title={title} center color="black" />
        {subtitle && (
          <>
            <br />
            <StyledSimpleIconCTACardsGridSubtitle>
              <Text size="large" center>
                {subtitle}
              </Text>
            </StyledSimpleIconCTACardsGridSubtitle>
          </>
        )}
        <StyledSimpleIconCTACardsGrid>
          {cards.map((card) => {
            const uuid = uuidV4();
            return (
              <StyledSimpleIconCTACard key={uuid}>
                {card.icon}
                <StyledSimpleIconCTACardsTitle>
                  <H3 title={card.title} center />
                </StyledSimpleIconCTACardsTitle>
                <StyledSimpleIconCTACardsContent>
                  <Text size="large">{card.description}</Text>
                </StyledSimpleIconCTACardsContent>
                <Button
                  onClick={card.onClick}
                  href={card.href}
                  variant="primary"
                  rounded
                >
                  {card.CTAText}
                </Button>
              </StyledSimpleIconCTACard>
            );
          })}
        </StyledSimpleIconCTACardsGrid>
      </Section>
    </StyledSimpleIconCTACardsGridBackground>
  );
};
