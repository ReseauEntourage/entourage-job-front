import React, { Ref } from 'react';
import { IlluCalendrier, OrienterSablier } from 'assets/icons/icons';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button } from 'src/components/utils';
import { List } from 'src/components/utils/Lists';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledAiderProgrammesListElement } from './TravaillerProgrammes.styles';

const content = [
  {
    title: 'Un CV humain et convaincant',
    paragraph:
      "Un CV qui casse les codes et valorise le parcours du candidat quel qu'il soit et incite à la rencontre",
    src: '/static/img/orienter-cv.png',
  },
  {
    title: 'Une diffusion élargie du CV',
    paragraph:
      'Grâce aux partages du grand public sur les réseaux sociaux via la plateforme',
    src: '/static/img/orienter-diffuser.png',
  },
  {
    title: 'Des opportunités d’emplois supplémentaires',
    paragraph:
      "Des offres d'emplois des entreprises partenaires et des coups de pouce de citoyens engagés",
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
    color: COLORS.primaryOrange,
    width: 35,
    height: 35,
  };
  return (
    <>
      <SimpleImageText
        backgroundColor="blue"
        innerRef={innerRef}
        title="Programme Coup de pouce"
        img="/static/img/orientation_who.jpg"
      >
        <List animated>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluCalendrier {...iconsProps} /> <div>Ponctuel</div>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <OrienterSablier {...iconsProps} /> <div>Selon vos besoins</div>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <CarteSolidaireIcon {...iconsProps} />{' '}
            <div>En physique ou en visio</div>
          </StyledAiderProgrammesListElement>
        </List>
        <div data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > p; delay: 200;">
          <p>
            Le programme Coup de pouce vous permet de solliciter et de
            bénéficier de coups de pouce ponctuels pour vous aider dans votre
            recherche d&lsquo;emploi.
          </p>
          <p>
            Une véritable communauté d&lsquo;experts bénévoles est à votre
            disposition pour vous proposer :
          </p>
          <List animated>
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
              - Des conseils et une méhtodologie pour des recherches d’emploi
              efficaces
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - Et tous autres partages d&lsquo;expérience utiles !
            </StyledAiderProgrammesListElement>
          </List>
        </div>
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
          S&lsquo;inscrire au programme
        </Button>
      </SimpleImageText>
      <RowIconTitleText content={content} backgroundColor="blue" />
    </>
  );
};
