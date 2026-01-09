import Link from 'next/link';
import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Button, Section, Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
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
    value: 20,
    description: (
      <Text>
        Financez des ateliers collectifs remobilisant des personnes en précarité
        pour les aider à acquérir de nouvelles compétences.
      </Text>
    ),
    color: COLORS.blueShade1,
  },
  {
    value: 70,
    description: (
      <Text>
        Permettez à des jeunes en précarité de partir en week-end de cohésion
        pour se remobiliser.
      </Text>
    ),
    color: COLORS.blueShade2,
  },
  {
    value: 250,
    description: (
      <Text>
        Permettez à des candidats Entourage Pro de rencontrer des professionnels
        pour trouver des opportunités d’emploi.
      </Text>
    ),
    color: COLORS.primaryBlue,
  },
  {
    value: 500,
    description: (
      <Text>
        Participez à l’accompagnement d’une personne en précarité pour qu’elle
        retrouve un emploi.
      </Text>
    ),
    color: COLORS.blueShade3,
  },
] as const;

export const NousSoutenir = () => {
  const isDesktop = useIsDesktop();
  return (
    <Section>
      <H2 center title="Nous soutenir" />
      <StyledNousSoutenirCardsContainer>
        {content.map((item) => {
          const uuid = uuidV4();
          return (
            <Link
              href={`${
                process.env.NEXT_PUBLIC_DONATION_LINK || ''
              }&frequency=once&amount=${item.value * 100}`}
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
          variant="primary"
          rounded
          onClick={() => {
            gaEvent(GA_TAGS.HOME_NOUS_SOUTENIR_FAIRE_UN_DON_CLICK);
          }}
          href={process.env.URL_DONATION || ''}
        >
          Faire un don
        </Button>
      </StyledNousSoutenirButton>
    </Section>
  );
};
