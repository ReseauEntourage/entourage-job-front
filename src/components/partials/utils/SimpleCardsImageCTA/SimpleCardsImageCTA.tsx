import React from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Img, Section, Text } from 'src/components/utils';
import { H2, H3 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { AnyToFix } from 'src/utils/Types';
import {
  StyledCriteria,
  StyledCriteriasContainer,
  StyledSimpleCardsImageCTACard,
  StyledSimpleCardsImageCTAContainer,
  StyledSimpleCardsImageCTASubtitle,
  StyledTitleContainer,
} from './SimpleCardsImageCTA.styles';

interface Criteria {
  illu: React.ReactNode;
  text: string;
}

export interface SimpleCardImageCTAProps {
  title: string;
  description: string;
  img: string;
  criterias?: Criteria[];
  onClick?: () => void;
  href?: string | { pathname: string; query: AnyToFix };
  className?: string;
  CTAText: string;
}

interface SimpleCardsImageCTAProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  cards: SimpleCardImageCTAProps[];
}

export const SimpleCardsImageCTA = ({
  title,
  subtitle,
  cards,
}: SimpleCardsImageCTAProps) => {
  const isDesktop = useIsDesktop();

  return (
    <Section>
      <StyledTitleContainer>
        <H2 title={title} center />
        {subtitle && (
          <StyledSimpleCardsImageCTASubtitle>
            <Text size="xlarge" center>
              {subtitle}
            </Text>
          </StyledSimpleCardsImageCTASubtitle>
        )}
      </StyledTitleContainer>
      <StyledSimpleCardsImageCTAContainer>
        {cards.map((card) => {
          const uuidValue = uuid();
          return (
            <StyledSimpleCardsImageCTACard
              key={uuidValue}
              className={`${isDesktop ? '' : 'mobile'} ${card.className}`}
            >
              <div className="image-container">
                <Img src={card.img} alt="" cover />
              </div>
              <div className="content">
                <div className="text-container">
                  <H3 title={card.title} />
                  {card.criterias && (
                    <StyledCriteriasContainer>
                      {card.criterias?.map((criteria) => (
                        <StyledCriteria>
                          {criteria.illu}
                          <Text size="large" color="darkGray">
                            {criteria.text}
                          </Text>
                        </StyledCriteria>
                      ))}
                    </StyledCriteriasContainer>
                  )}
                  <Text size="xlarge">{card.description}</Text>
                </div>
                <div>
                  <Button
                    style="custom-secondary"
                    href={card.href}
                    onClick={() => {
                      if (card.onClick) card.onClick();
                    }}
                  >
                    {card.CTAText}
                  </Button>
                </div>
              </div>
            </StyledSimpleCardsImageCTACard>
          );
        })}
      </StyledSimpleCardsImageCTAContainer>
    </Section>
  );
};
