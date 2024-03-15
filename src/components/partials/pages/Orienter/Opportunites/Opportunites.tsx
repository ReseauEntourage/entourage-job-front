import React from 'react';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';

const content = [
  {
    title: 'Un CV humain et convaincant',
    paragraph:
      "Un CV qui casse les codes et valorise le parcours du candidat quel qu'il soit et incite à la rencontre",
    src: '/static/img/orienter-cv.png',
  },
  {
    title: 'Une diffusion élargie du CV',
    paragraph:
      'Grâce aux partages du grand public sur les réseaux sociaux via la plateforme',
    src: '/static/img/orienter-diffuser.png',
  },
  {
    title: 'Des opportunités d’emplois supplémentaires',
    paragraph:
      "Des offres d'emplois des entreprises partenaires et des coups de pouce de citoyens engagés",
    src: '/static/img/orienter-emploi.png',
  },
  {
    title: 'Des temps forts collectifs',
    paragraph:
      'Des expériences humaines formatrices, fédératrices et positives',
    src: '/static/img/orienter-calendrier.png',
  },
];

export const Opportunites = () => {
  return (
    <RowIconTitleText
      backgroundColor='blue'
      title="Ce qu'Entourage Pro apporte à vos bénéficiaires"
      content={content}
    />
  );
};
