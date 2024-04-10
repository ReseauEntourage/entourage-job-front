import React, { Ref } from 'react';
import { SimpleCardsImageCTA } from 'src/components/partials/utils/SimpleCardsImageCTA';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const AiderDecouvrir = ({
  handleClick,
  refCoupDePouce,
  refProgramme360,
}: {
  handleClick: (ref: Ref<HTMLDivElement>) => void;
  refCoupDePouce: Ref<HTMLDivElement>;
  refProgramme360: Ref<HTMLDivElement>;
}) => {
  return (
    <SimpleCardsImageCTA
      title="Découvrez nos modes d’engagement pour soutenir nos candidat(e)s"
      subtitle="Recréer un réseau professionnel pour et avec les personnes en situation d’exclusion est crucial. Cela permet de générer des opportunités d'emploi et d’apporter son soutien pour briser les barrières socio-économiques, favoriser l'inclusion et renforcer l’estime de soi. Pour y arriver, nous proposons deux modes d’engagement"
      cards={[
        {
          title: 'Format Coup de pouce',
          description:
            'Donnez des coups de pouce variés et ponctuels à nos candidat(e)s : améliorer un CV, préparer un entretien d’embauche, être mis en relation, etc.',
          img: '/static/img/aider-decouvrir-coup-de-pouce.jpg',
          onClick: () => {
            handleClick(refCoupDePouce);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_COUP_DE_POUCE_CLICK);
          },
          CTAText: 'Découvrir',
        },
        {
          title: 'Format 360',
          description:
            'Engagez-vous avec un(e) candidat(e) dans un accompagnement  sur 6 mois, de la définition de son projet jusqu’à sa prise de poste !',
          img: '/static/img/aider-decouvrir-360.jpg',
          onClick: () => {
            handleClick(refProgramme360);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_360_CLICK);
          },
          CTAText: 'Découvrir',
        },
      ]}
    />
  );
};
