import Link from 'next/link';
import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Button, Section, Typography } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledNousSoutenirButton,
  StyledNousSoutenirCard,
  StyledNousSoutenirCardLowerPart,
  StyledNousSoutenirCardsContainer,
  StyledNousSoutenirCardUpperPart,
} from './NousSoutenir.styles';

const content = [
  {
    value: '50',
    description: (
      <Typography>
        Vous financez <span>5 rencontres nomades</span>, nos maraudes de lien
        social.
      </Typography>
    ),
    color: COLORS.blueShade1,
  },
  {
    value: '100',
    description: (
      <Typography>
        Vous nous aidez à <span>recréer du lien social</span> autour d&lsquo;une
        soirée jeux de société mêlant riverains et personnes en précarité.
      </Typography>
    ),
    color: COLORS.blueShade2,
  },
  {
    value: '250',
    description: (
      <Typography>
        Vous participez au{' '}
        <span>financement de l&lsquo;animation de la communauté</span> pour
        faciliter la rencontre et la mise en place d&lsquo;actions solidaires.
      </Typography>
    ),
    color: COLORS.primaryBlue,
  },
  {
    value: '500',
    description: (
      <Typography>
        Vous permettez à Entourage d&lsquo;inviter une dizaine de personnes
        isolées à l&lsquo;un des{' '}
        <span>prochains grands événements sportifs</span>.
      </Typography>
    ),
    color: COLORS.blueShade3,
  },
] as const;

export const NousSoutenir = () => {
  const isDesktop = useIsDesktop();
  return (
    <Section>
      <H2 center color="black" title="Nous soutenir" />
      <StyledNousSoutenirCardsContainer>
        {content.map((item) => {
          const uuid = uuidV4();
          return (
            <Link
              href={
                process.env.URL_DONATION
                  ? new URL(process.env.URL_DONATION)
                  : ''
              }
              target="_blank"
              key={uuid}
            >
              <StyledNousSoutenirCard className={isDesktop ? '' : 'mobile'}>
                <StyledNousSoutenirCardUpperPart color={item.color}>
                  {item.value} €
                </StyledNousSoutenirCardUpperPart>
                <StyledNousSoutenirCardLowerPart>
                  {item.description}
                </StyledNousSoutenirCardLowerPart>
              </StyledNousSoutenirCard>
            </Link>
          );
        })}
      </StyledNousSoutenirCardsContainer>
      <StyledNousSoutenirButton>
        <Button
          style="custom-secondary-inverted"
          onClick={() => {
            gaEvent(GA_TAGS.HOME_NOUS_SOUTENIR_MESURE_D_IMPACT);
          }}
          href={process.env.URL_MESURE_D_IMPACT}
        >
          Téléchargez la mesure d&lsquo;impact
        </Button>
      </StyledNousSoutenirButton>
    </Section>
  );
};
