import React from 'react';
import {
  IlluCoeurMainsOuvertesBleu,
  IlluCV,
  IlluDossierCandidat,
  IlluMalette,
} from 'assets/icons/icons';
import {
  Button,
  Section,
  Typography,
  StyledCenteredButtonContainer,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledFigure,
  StyledFigureMobileContainer,
  StyledFigureNumber,
  StyledFiguresContainer,
  StyledFiguresSubtitle,
  StyledMobileFigure,
} from './Figures.styles';

const staticNumbers = [
  {
    icon: <IlluCV width={140} height={110} />,
    value: '+ 500',
    description: 'candidat(e)s accompagnés',
  },
  {
    icon: <IlluMalette width={140} height={110} />,
    value: '700',
    description: 'entreprises mobilisées',
  },
  {
    icon: <IlluDossierCandidat width={140} height={110} />,
    value: '70%',
    description: 'de sorties positives en 2023',
  },
  {
    icon: (
      <IlluCoeurMainsOuvertesBleu
        width={140}
        height={110}
        color={COLORS.hoverBlue}
      />
    ),
    value: '+ 1000',
    description: 'bénévoles engagés',
  },
];

export const Figures = () => {
  const isDesktop = useIsDesktop();
  return (
    <Section id="profiles">
      <H2 title="Et le mieux c'est que ça marche" color="black" center />
      <StyledFiguresSubtitle>
        <Typography size="large">
          Nos candidat(e)s et nos coachs peuvent en témoigner. Les chiffres
          aussi !
        </Typography>
      </StyledFiguresSubtitle>
      {isDesktop ? (
        <StyledFiguresContainer>
          {staticNumbers.map((number) => {
            return (
              <StyledFigure key={number.description}>
                {number.icon}
                <StyledFigureNumber>{number.value}</StyledFigureNumber>
                <Typography size="large" color="blue">
                  {number.description}
                </Typography>
              </StyledFigure>
            );
          })}
        </StyledFiguresContainer>
      ) : (
        <StyledFigureMobileContainer>
          {staticNumbers.map((number) => {
            return (
              <StyledMobileFigure key={number.description}>
                {number.icon}
                <StyledFigureNumber>{number.value}</StyledFigureNumber>
                <Typography size="large" color="blue">
                  {number.description}
                </Typography>
              </StyledMobileFigure>
            );
          })}
        </StyledFigureMobileContainer>
      )}
      <StyledCenteredButtonContainer>
        <Button
          style="custom-secondary-inverted"
          onClick={() => {
            gaEvent(GA_TAGS.HOME_CHIFFRES_MESURE_D_IMPACT_CLICK);
          }}
          href={process.env.URL_MESURE_D_IMPACT}
        >
          Téléchargez la mesure d&lsquo;impact
        </Button>
      </StyledCenteredButtonContainer>
    </Section>
  );
};
