import React from 'react';
import { SimpleCardsImageCTA } from 'src/components/partials/utils/SimpleCardsImageCTA';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const Rejoindre = () => {
  return (
    <SimpleCardsImageCTA
      title="Rejoindre Entourage Pro"
      subtitle="Besoin d'aide dans votre recherche d'emploi ou envie de partager votre expérience ? C'est ici !"
      cards={[
        {
          title: 'Je cherche un emploi',
          description:
            "Vous avez besoin d'aide ? Notre communauté de coachs met son expertise à votre disposition pour vous proposer l'accompagnement qu'il vous faut.",
          img: '/static/img/orientation_who.jpg',
          href: '/travailler',
          CTAText: 'Devenir candidat(e)',
          onClick: () => {
            gaEvent(GA_TAGS.HOME_REJOINDRE_CANDIDAT_CLICK);
          },
        },
        {
          title: 'Je veux aider',
          description:
            "Vous souhaitez accompagner nos candidat(e)s dans leur retour à l'emploi et donner du sens à votre expérience ? C'est ici que ça se passe !",
          img: '/static/img/orienter-decouvrir-2.png',
          href: '/aider',
          CTAText: 'Devenir coach',
          onClick: () => {
            gaEvent(GA_TAGS.HOME_REJOINDRE_COACH_CLICK);
          },
        },
      ]}
    />
  );
};
