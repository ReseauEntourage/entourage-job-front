import React, { Ref } from 'react';
import {
  IlluCalendrier,
  IlluQuestionReponseOrange,
  OrienterSablier,
} from 'assets/icons/icons';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';
import { List } from 'src/components/utils/Lists';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledAiderProgrammesListElement } from './AiderProgrammes.styles';

export const AiderProgrammeCoupDePouce = ({
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
        img="/static/img/aider-coup-de-pouce-tall.jpg"
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
            <IlluQuestionReponseOrange {...iconsProps} />
            <Text color="light">En physique ou en visio</Text>
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
            En tant que coach Coup de pouce, vous tenez un rôle clé dans la
            démarche de nos candidat(e)s de retrouver un emploi ou une
            formation.
          </p>
          <p>
            Complémentaire aux conseillers mission locale ou aux travailleurs
            sociaux, vous êtes un compagnon de route, un véritable booster dans
            cette période souvent challengeante pour des personnes sans réseau
            professionnel, très éloignées du monde du travail et dont le
            quotidien est souvent semé d&apos;embûches.
          </p>
          <p>
            Votre soutien se matérialise par des coups de pouce ponctuels, selon
            vos disponibilités et les besoins des candidat(e)s :
          </p>
          <p>-&nbsp;relayer une recherche d’emploi sur LinkedIn</p>
          <p>-&nbsp;diffuser une offre</p>
          <p>-&nbsp;partager votre expérience et vos conseils</p>
          <p>-&nbsp;aider à l’élaboration du CV</p>
          <p>-&nbsp;préparer un entretien</p>
          <p>-&nbsp;etc.</p>
          <p>
            Chaque soutien que vous apporterez, qu’il soit par une aide concrète
            ou par un petit mot d’encouragement sur le réseau, permettra aux
            candidat(e)s d’avancer toujours un peu plus vers leur inclusion
            professionnelle !
          </p>
        </div>
        <Button
          style="custom-secondary-inverted"
          onClick={() => {
            gaEvent(
              GA_TAGS.PAGE_AIDER_PROGRAMME_COUP_DE_POUCE_INSCRIPTION_CLICK
            );
          }}
          dataTestId="button-inscrire-coup-de-pouce"
          href="/inscription"
        >
          Devenir coach Coup de pouce
        </Button>
      </SimpleImageText>
    </>
  );
};
