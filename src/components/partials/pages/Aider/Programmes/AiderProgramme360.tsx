import React, { Ref } from 'react';
import {
  IlluCalendrier,
  IlluQuestionReponseOrange,
  OrienterCarteSolidaire,
  OrienterSablier,
} from 'assets/icons/icons';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';
import { List } from 'src/components/utils/Lists';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledAiderProgrammesListElement } from './AiderProgrammes.styles';

export const AiderProgramme360 = ({
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
        innerRef={innerRef}
        title="Format 360"
        img="/static/img/aider-360-tall.jpg"
        reverse
      >
        <List animated>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluCalendrier {...iconsProps} />{' '}
            <Text color="light">Durée de 6 mois</Text>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <OrienterSablier {...iconsProps} />{' '}
            <Text color="light">2 heures par semaine</Text>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluQuestionReponseOrange {...iconsProps} />
            <Text color="light">En physique</Text>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <OrienterCarteSolidaire {...iconsProps} />{' '}
            <Text color="light">
              Disponible à Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis
              (93), Lille, Lyon, Rennes ou Lorient
            </Text>
          </StyledAiderProgrammesListElement>
        </List>
        <div data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > p; delay: 200;">
          <p>
            Le format 360, c’est une démarche collaborative et engageante pour
            un impact significatif dans la vie des candidat(e)s.
          </p>
          <p>
            En devenant coach 360, vous devenez le ou la binôme d’un(e)
            candidat(e) et lui offrez soutien, confiance et partage
            d&apos;expérience tout au long de cette étape de vie, qui peut
            parfois être longue et décourageante quand on n’est pas bien
            entouré.
          </p>
          <p>
            L’idée est de combiner vos propres réseaux avec celui
            d&apos;Entourage Pro pour générer et faciliter des opportunités
            d&apos;emploi pour le candidat ou la candidate que vous accompagnez.
          </p>
          <p>
            Concrètement, vous vous engagez auprès d’un(e) candidat(e) pendant
            environ 6 mois, avec des sessions hebdomadaires de 2 heures et le ou
            la soutenez pour :
          </p>
          <p>-&nbsp;créer et promouvoir un CV adapté</p>
          <p>-&nbsp;dénicher des offres d&apos;emploi</p>
          <p>-&nbsp;se constituer son propre réseau</p>
          <p>-&nbsp;appréhender les codes du monde professionnel</p>
          <p>-&nbsp;se préparer aux entretiens</p>
          <p>
            -&nbsp;s’intégrer et faire ses premiers pas dans son nouveau job
          </p>
          <p>
            Cette approche vise bien sûr à soutenir les candidat(e)s mais aussi
            à créer une véritable relation de confiance, privilégiée et pérenne.
          </p>
        </div>
        <Button
          style="custom-secondary-inverted"
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_AIDER_PROGRAMME_360_INSCRIPTION_CLICK);
          }}
          dataTestId="button-inscrire-coup-de-pouce"
          href="/inscription"
        >
          Devenir coach 360
        </Button>
      </SimpleImageText>
    </>
  );
};
