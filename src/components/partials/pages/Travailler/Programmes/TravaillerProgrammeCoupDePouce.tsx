import React, { Ref } from 'react';
import {
  IlluCalendrier,
  IlluQuestionReponseOrange,
  OrienterSablier,
} from 'assets/icons/icons';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';
import { List } from 'src/components/utils/Lists';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  FlexContainer,
  StyledAiderProgrammesListElement,
} from './TravaillerProgrammes.styles';

const content = [
  {
    title: 'Un CV humain et convaincant',
    paragraph:
      "Un CV qui casse les codes et valorise le parcours du candidat quel qu'il soit et incite à la rencontre",
    src: '/static/img/orienter-cv.png',
  },
  {
    title: 'Une diffusion élargie de votre profil',
    paragraph:
      'Via notre réseau, celui de notre communauté de coachs mais aussi les partages du grand public sur les réseaux sociaux',
    src: '/static/img/orienter-diffuser.png',
  },
  {
    title: 'Un max d’opportunités professionnelles',
    paragraph:
      "Des offres d'emplois des entreprises partenaires et des mises en relation adaptées selon votre projet pro",
    src: '/static/img/orienter-emploi.png',
  },
  {
    title: 'Des temps forts collectifs',
    paragraph:
      'Des expériences humaines formatrices, fédératrices et positives',
    src: '/static/img/orienter-calendrier.png',
  },
];

export const TravaillerProgrammeCoupDePouce = ({
  innerRef,
}: {
  innerRef?: Ref<HTMLDivElement>;
}) => {
  const isDesktop = useIsDesktop();
  const iconsProps = {
    color: COLORS.orangeSocial,
    width: 35,
    height: 35,
  };
  return (
    <>
      <SimpleImageText
        backgroundColor="blue"
        innerRef={innerRef}
        title="Format Coup de pouce"
        img="/static/img/travailler-coup-de-pouce-tall.png"
      >
        <List>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluCalendrier {...iconsProps} />{' '}
            <Text color="light">Ponctuel</Text>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <OrienterSablier {...iconsProps} />{' '}
            <Text color="light">Selon vos besoins</Text>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluQuestionReponseOrange {...iconsProps} />{' '}
            <Text color="light">Prise de contact en physique ou en visio</Text>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <CarteSolidaireIcon {...iconsProps} />{' '}
            <Text color="light">Disponible partout en France</Text>
          </StyledAiderProgrammesListElement>
        </List>
        <div>
          <p>
            Le format Coup de pouce vous permet de solliciter et de bénéficier
            de coups de pouce ponctuels pour vous aider dans votre recherche
            d&lsquo;emploi.
          </p>
          <p>
            Une véritable communauté d’experts bénévoles est à votre disposition
            pour vous proposer :
          </p>
          <List>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - Des ateliers thématiques, autour de du CV ou des entretiens par
              exemple
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - De partager leur réseau et de viraliser votre CV
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - Des conseils et une méthodologie pour des recherches d’emploi
              efficaces
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - Et tous autres partages d&lsquo;expérience utiles !
            </StyledAiderProgrammesListElement>
          </List>
        </div>
        <FlexContainer>
          <Button
            style="custom-secondary-inverted"
            onClick={() => {
              gaEvent(
                GA_TAGS.PAGE_TRAVAILLER_PROGRAMME_COUP_DE_POUCE_INSCRIPTION_CLICK
              );
            }}
            dataTestId="button-inscrire-coup-de-pouce"
            href="/inscription"
          >
            S&lsquo;inscrire
          </Button>
          {/* Todo: gaEvent and url tbd */}
          <Button
            style="custom-secondary"
            dataTestId="button-orienter-candidat"
            href="/inscription"
          >
            Orienter un candidat
          </Button>
        </FlexContainer>
      </SimpleImageText>
      <RowIconTitleText content={content} backgroundColor="blue" />
    </>
  );
};
