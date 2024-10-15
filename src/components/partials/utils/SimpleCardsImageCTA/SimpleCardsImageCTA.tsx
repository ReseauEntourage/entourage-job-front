import React from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Img, Section, Typography } from 'src/components/utils';
import { H2, H5 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import { AnyToFix } from 'src/utils/Types';
import {
  StyledSimpleCardsImageCTACard,
  StyledSimpleCardsImageCTAContainer,
  StyledSimpleCardsImageCTASubtitle,
} from './SimpleCardsImageCTA.styles';

export interface SimpleCardImageCTAProps {
  title: string;
  description: string;
  img: string;
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
      <H2 title={title} color="black" center />
      {subtitle && (
        <StyledSimpleCardsImageCTASubtitle>
          <Typography size="large" center>
            {subtitle}
          </Typography>
        </StyledSimpleCardsImageCTASubtitle>
      )}
      <StyledSimpleCardsImageCTAContainer data-uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .decouvrir-card; delay: 200">
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
              <div className="text-container">
                <H5 title={card.title} color="primaryBlue" center />
                <p className="text">{card.description}</p>
                <Button
                  style="custom-secondary-inverted"
                  href={card.href}
                  onClick={() => {
                    if (card.onClick) card.onClick();
                  }}
                >
                  {card.CTAText}
                </Button>
              </div>
            </StyledSimpleCardsImageCTACard>
          );
        })}
      </StyledSimpleCardsImageCTAContainer>
    </Section>
  );
};
