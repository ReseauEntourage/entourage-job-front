import React, { Ref } from 'react';
import {
  IlluCalendrier,
  IlluQuestionReponseOrange,
  IlluTeteHomme,
  OrienterCarteSolidaire,
  OrienterSablier,
} from 'assets/icons/icons';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button, Text } from 'src/components/utils';
import { List } from 'src/components/utils/Lists';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledAiderProgrammesCTAsContainer,
  StyledAiderProgrammesListElement,
} from './TravaillerProgrammes.styles';

const content = [
  {
    title: 'Un CV sur-mesure',
    paragraph:
      'Avec la relecture de votre parcours et la formalisation de vos envies professionnelles',
    src: '/static/img/orienter-cv.png',
  },
  {
    title: 'Un réseau partagé',
    paragraph:
      'Grâce à l’activation et au partage de son réseau pro par votre coach',
    src: '/static/img/orienter-diffuser.png',
  },
  {
    title: 'Une aide personnalisée dans vos recherches',
    paragraph:
      "Avec la préparation aux entretiens d'embauche et le soutien de vos candidatures",
    src: '/static/img/orienter-emploi.png',
  },
  {
    title: 'Une relation unique !',
    paragraph:
      'Une relation de confiance avec votre coach qui peut durer bien au-delà de votre prise de poste',
    src: '/static/img/orienter-handshake.jpg',
  },
];

export const TravaillerProgramme360 = ({
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
        img="/static/img/travailler-360-tall.png"
        reverse
      >
        <List animated>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluTeteHomme {...iconsProps} />{' '}
            <Text color="light">Pour les jeunes de moins de 30 ans</Text>
          </StyledAiderProgrammesListElement>
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
            Le format 360 vous propose un accompagnement personnalisé de 6 mois
            avec un coach dédié.
          </p>
          <p>
            Votre coach vous accompagnera tout au long de votre recherche
            d’emploi. <br />
            Nos équipes sont formées pour faire matcher des profils compatibles
            et que vous puissiez bénéficier de l’accompagnement le plus efficace
            possible.
          </p>
          <p>
            Vous pourrez compter sur votre coach pour vous conseiller notamment
            sur les thématiques suivantes :
          </p>
          <List animated>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - La définition de votre projet professionnel
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - La création de votre CV et de votre lettre de motivation
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - La préparation aux entretiens
            </StyledAiderProgrammesListElement>
            <StyledAiderProgrammesListElement
              className={isDesktop ? '' : 'mobile'}
            >
              - L’aide dans les recherches et la mobilisation de son réseau
            </StyledAiderProgrammesListElement>
          </List>
        </div>
        {/* <MultipleCTA
          data={[
            {
              button: {
                label: "S'inscrire",
                style: 'custom-secondary-inverted',
                onClick: () =>
                  gaEvent(
                    GA_TAGS.PAGE_TRAVAILLER_PROGRAMME_360_INSCRIPTION_CLICK
                  ),
                href: '/inscription',
              },
            },
            {
              button: {
                label: 'En savoir plus',
                style: 'custom-secondary',
                onClick: () =>
                  gaEvent(
                    GA_TAGS.PAGE_TRAVAILLER_PROGRAMME_360_EN_SAVOIR_PLUS_CLICK
                  ),
                href: '/travailler/programme-360',
              },
            },
          ]}
        /> */}
        <StyledAiderProgrammesCTAsContainer>
          <Button
            style="custom-secondary-inverted"
            onClick={() =>
              gaEvent(GA_TAGS.PAGE_TRAVAILLER_PROGRAMME_360_INSCRIPTION_CLICK)
            }
            href="/inscription"
          >
            S&lsquo;inscrire
          </Button>
          <Button
            style="custom-secondary"
            onClick={() =>
              gaEvent(
                GA_TAGS.PAGE_TRAVAILLER_PROGRAMME_360_EN_SAVOIR_PLUS_CLICK
              )
            }
            href="/travailler/programme-360"
          >
            En savoir plus
          </Button>
        </StyledAiderProgrammesCTAsContainer>
      </SimpleImageText>
      <RowIconTitleText content={content} />
    </>
  );
};
