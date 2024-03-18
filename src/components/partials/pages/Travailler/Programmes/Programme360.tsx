import React, { Ref } from 'react';
import { IlluCalendrier, OrienterSablier } from 'assets/icons/icons';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import { MultipleCTA } from 'src/components/partials/utils/MultipleCTA';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledProgrammesList } from './Programmes.styles';

const content = [
  {
    title: 'Réalisation du CV façon entourage pro',
    paragraph:
      'Relecture du parcours du candidat et formalisation des envies professionnelles',
    src: '/static/img/orienter-cv.png',
  },
  {
    title: "Création d'opportunités professionnelles",
    paragraph: 'Activer son réseau avec le candidat',
    src: '/static/img/orienter-diffuser.png',
  },
  {
    title: 'Préparation la recherche d’emploi',
    paragraph:
      "Préparation aux entretiens d'embauche et soutien des candidatures",
    src: '/static/img/orienter-emploi.png',
  },
  {
    title: 'Facilitation de l’intégration en entreprise',
    paragraph:
      "Faciliter les échanges avec le recruteurs dans la phase d'intégration et soutenir le candidat dans sa prise de poste",
    src: '/static/img/orienter-calendrier.png',
  },
];

export const Programme360 = ({
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
        innerRef={innerRef}
        title="Programme 360"
        img="/static/img/orientation_who.jpg"
        reverse
      >
        <StyledProgrammesList
          className={isDesktop ? '' : 'mobile'}
          data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
        >
          <li>
            <IlluCalendrier {...iconsProps} /> <div>Durée de 6 mois</div>
          </li>
          <li>
            <OrienterSablier {...iconsProps} /> <div>2 heures par semaine</div>
          </li>
          <li>
            <CarteSolidaireIcon {...iconsProps} /> <div>En physique</div>
          </li>
        </StyledProgrammesList>
        <div data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > p; delay: 200;">
          <p>
            Le programme 360 vous propose un accompagnement personnalisé de 6
            mois avec un coach dédié.
          </p>
          <p>
            Votre coach vous accompagnera tout au long de votre recherche
            d’emploi. <br /> Nos équipes sont formées pour faire matcher des
            profils compatibles et que vous puissiez bénéficier de
            l’accompagnement le plus efficace possible.
          </p>
          <p>
            Vous pourrez compter sur votre coach pour vous conseiller notamment
            sur les thématiques suivantes :
          </p>
          <StyledProgrammesList data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;">
            <li>- La définition de votre projet professionnel</li>
            <li>- La création de votre CV et de votre lettre de motivation</li>
            <li>- La préparation aux entretiens</li>
            <li>- L’aide dans les recherches</li>
          </StyledProgrammesList>
        </div>
        <MultipleCTA
          data={[
            {
              button: {
                label: "S'inscrire au programme",
                style: 'custom-secondary-inverted',
                removeChevron: true,
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
                removeChevron: true,
                onClick: () =>
                  gaEvent(
                    GA_TAGS.PAGE_TRAVAILLER_PROGRAMME_360_EN_SAVOIR_PLUS_CLICK
                  ),
                href: '/travailler/programme-360',
              },
            },
          ]}
        />
      </SimpleImageText>
      <RowIconTitleText content={content} />
    </>
  );
};
