import React from 'react'
import { Button, Section, Typography } from 'src/components/utils'
import { H2, H3 } from 'src/components/utils/Headings'
import { StyledSimpleIconCTACard, StyledSimpleIconCTACardsGrid, StyledSimpleIconCTACardsGridBackground, StyledSimpleIconCTACardsGridSubtitle } from './SimpleIconCTACardsGrid.styles'
import { v4 as uuidV4 } from 'uuid';

export const SimpleIconCTACardsGrid = ({
    title,
    subtitle,
    cards
}) => {
  return (
    <StyledSimpleIconCTACardsGridBackground>
        <Section>
            <H2
                title={title}
                center
                color="black"
            />
            {subtitle && <StyledSimpleIconCTACardsGridSubtitle>
                <Typography size="large">
                    {subtitle}
                </Typography>
            </StyledSimpleIconCTACardsGridSubtitle>}
            <StyledSimpleIconCTACardsGrid>
                {
                    cards.map(card => {
                        const uuid = uuidV4();
                        return(
                            <StyledSimpleIconCTACard key={uuid}>
                                {card.icon}
                                <H3 title={card.title} center />
                                <Typography size="large">
                                    {card.description}
                                </Typography>
                                <Button
                                    onClick={card.onClick}
                                    href={card.href}
                                    style="custom-secondary-inverted"
                                >
                                    {card.CTAText}
                                </Button>
                            </StyledSimpleIconCTACard>
                        )
                    })
                }
            </StyledSimpleIconCTACardsGrid>
        </Section>
    </StyledSimpleIconCTACardsGridBackground>
  )
}
