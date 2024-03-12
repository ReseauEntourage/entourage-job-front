import React from 'react'
import { Button, Section, Typography } from 'src/components/utils'
import { H2 } from 'src/components/utils/Headings'
import { COLORS } from 'src/constants/styles'
import { StyledNousSoutenirCard, StyledNousSoutenirCardLowerPart, StyledNousSoutenirCardsContainer, StyledNousSoutenirCardUpperPart } from './NousSoutenir.styles'

const content = [
    {
        value: "50",
        description: <Typography>Vous financez <span>5 rencontres nomades</span>, nos maraudes de lien social.</Typography>,
        color: COLORS.blueShade1
    },
    {
        value: "100",
        description: <Typography>Vous nous aidez à <span>recréer du lien social</span> autour d'une soirée jeux de société mêlant riverains et personnes en précarité.</Typography>,
        color: COLORS.blueShade2
    },
    {
        value: "250",
        description: <Typography>Vous participez au <span>financement de l'animation de la communauté</span> pour faciliter la rencontre et la mise en place d'actions solidaires.</Typography>,
        color: COLORS.primaryBlue
    },
    {
        value: "500",
        description: <Typography>Vous permettez à Entourage d'inviter une dizaine de personnes isolées à l'un des <span>prochains grands événements sportifs</span>.</Typography>,
        color: COLORS.blueShade3
    },
] as const;

export const NousSoutenir = () => {
  return (
    <Section>
        <H2 center color="black" title="Nous soutenir"/>
        <StyledNousSoutenirCardsContainer>
            {
                content.map((item) => {
                    return (
                        <StyledNousSoutenirCard>
                            <StyledNousSoutenirCardUpperPart color={item.color}>
                                {item.value}{' '}€
                            </StyledNousSoutenirCardUpperPart>
                            <StyledNousSoutenirCardLowerPart>
                                {item.description}
                            </StyledNousSoutenirCardLowerPart>
                        </StyledNousSoutenirCard>
                    )
                })
            }
        </StyledNousSoutenirCardsContainer>
        <Button
            style="custom-secondary-inverted"

        >
            Téléchargez la mesure d'impact
        </Button>
    </Section>
  )
}
