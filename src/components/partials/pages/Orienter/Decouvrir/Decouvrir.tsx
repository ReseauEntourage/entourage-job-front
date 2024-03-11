import React, { Ref } from 'react';
import { SimpleCardsImageCTA } from 'src/components/partials/utils/SimpleCardsImageCTA';


export const Decouvrir = ({
  handleClick,
  refInscrire,
  refPublier,
}: {
  handleClick: (ref: Ref<HTMLDivElement>) => void;
  refInscrire: Ref<HTMLDivElement>;
  refPublier: Ref<HTMLDivElement>;
}) => {
  return (
    <SimpleCardsImageCTA
      title="Booster la recherche d'emploi des personnes que vous accompagnez"
      cards={[
        {
          title: "Parcours tremplin de 6 mois et publication du CV",
          description:
            "La personne que vous accompagnez est intéressée par notre programme d’accompagnement de 6 mois pour retrouver un emploi.",
          img: "/static/img/orientation_who.jpg",
          onClick: () => {
            handleClick(refInscrire);
          },
          className: "decouvrir-card",
          CTAText: "Découvrir",
        },
        {
          title: "Publication du CV sans parcours d’accompagnement",
          description:
            "La personne que vous accompagnez n’a pas besoin d’un accompagnement supplémentaire, mais son CV mérite un coup de pouce pour être visible !",
          img: "/static/img/orienter-decouvrir-2.png",
          onClick: () => {
            handleClick(refPublier);
          },
          className: "decouvrir-card",
          CTAText: "Découvrir",
        },
      ]}
    
    />
  )
};
