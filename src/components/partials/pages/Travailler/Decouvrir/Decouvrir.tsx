import React, { Ref } from 'react';
import { SimpleCardsImageCTA } from 'src/components/partials/utils/SimpleCardsImageCTA';

export const Decouvrir = ({
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
      title="Booster la recherche d'emploi des personnes que vous accompagnez"
      cards={[
        {
          title: 'Programme 360',
          description:
            'J’ai besoin d’un accompagnement personnalisé avec un coach dédié, qui m’aidera à de la définition de mon projet pro à l’aide dans mes recherches, en passant pour la création d’un CV et la préparation aux entretiens.',
          img: '/static/img/orientation_who.jpg',
          onClick: () => {
            handleClick(refCoupDePouce);
          },
          CTAText: 'Découvrir',
        },
        {
          title: 'Programme Coup de pouce',
          description:
            "Je souhaite solliciter et bénéficier de coups de pouces ponctuels de la part d’une communauté bénévole de pros pour m'aider dans ma recherche d'emploi (atelier CV et entretiens, partage de réseau, conseils pour la recherche, partage d'expérience...)",
          img: '/static/img/orienter-decouvrir-2.png',
          onClick: () => {
            handleClick(refProgramme360);
          },
          CTAText: 'Découvrir',
        },
      ]}
    />
  );
};
