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
      title="Découvrez nos programmes pour aider un candidat à retrouver une emploi"
      // description="Engagez-vous et aidez les candidats Entourage pro à retrouver un réseau, que vous soyez disponibles quelques minutes ou quelques mois."
      cards={[
        {
          title: 'Programme Coup de pouce',
          description:
            'La personne que vous accompagnez est intéressée par notre programme d’accompagnement de 6 mois pour retrouver un emploi.',
          img: '/static/img/orienter-decouvrir-2.png',
          onClick: () => {
            handleClick(refCoupDePouce);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_COUP_DE_POUCE_CLICK);
          },
          CTAText: 'Découvrir',
        },
        {
          title: 'Programme 360',
          description:
            'La personne que vous accompagnez n’a pas besoin d’un accompagnement supplémentaire, mais son CV mérite un coup de pouce pour être visible !',
          img: '/static/img/orientation_who.jpg',
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
