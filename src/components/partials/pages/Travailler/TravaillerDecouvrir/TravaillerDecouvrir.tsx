import React, { Ref } from 'react';
import { SimpleCardsImageCTA } from 'src/components/partials/utils/SimpleCardsImageCTA';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const TravaillerDecouvrir = ({
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
          title: 'Format Coup de pouce',
          description:
            "Je souhaite bénéficier de coups de pouce ponctuels de la communauté pour m'aider dans ma recherche d'emploi, que cela concerne la rédaction de mon CV, une relecture de ma lettre de motivation, ou une mise en relation.",
          img: '/static/img/travailler-decouvrir-coup-de-pouce.jpg',
          onClick: () => {
            handleClick(refCoupDePouce);
            gaEvent(
              GA_TAGS.PAGE_TRAVAILLER_DECOUVRIR_PROGRAMME_COUP_DE_POUCE_CLICK
            );
          },
          CTAText: 'Découvrir',
        },
        {
          title: 'Format 360',
          description:
            "J'ai besoin d’un accompagnement personnalisé avec un coach dédié, qui pourra m'aider à clarifier mon projet professionnel, à élaborer mon CV, à me préparer aux entretiens ainsi qu' à me guider dans mes recherches d'emploi par la mobilisation de son réseau.",
          img: '/static/img/travailler-decouvrir-360.jpg',
          onClick: () => {
            handleClick(refProgramme360);
            gaEvent(GA_TAGS.PAGE_TRAVAILLER_DECOUVRIR_PROGRAMME_360_CLICK);
          },
          CTAText: 'Découvrir',
        },
      ]}
    />
  );
};
