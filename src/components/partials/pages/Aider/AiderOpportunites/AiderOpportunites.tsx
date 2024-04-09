import React from 'react';
import { RowIconTitleText } from 'src/components/partials/utils/RowIconTitleText';

const content = [
  {
    title: 'Découvrir le coaching et l’associatif',
    paragraph: 'En faisant vos premiers pas à votre rythme',
    src: '/static/img/aider-coaching.png',
  },
  {
    title: 'Rejoindre une communauté d’experts',
    paragraph: 'Et ainsi élargir également votre propre réseau pro !',
    src: '/static/img/aider-diffuser.png',
  },
  {
    title: 'Donner du sens à sa vie professionnelle',
    paragraph: 'Grâce à une expérience humaine fédératrice et positive',
    src: '/static/img/aider-emploi.png',
  },
  {
    title: 'Ajouter une  ligne à son propre CV !',
    paragraph:
      'Qui a dit qu’on ne pouvait pas valoriser le fait d’aider les autres ?',
    src: '/static/img/aider-cv.png',
  },
];

export const AiderOpportunites = () => {
  return (
    <RowIconTitleText
      backgroundColor="blue"
      title="Pourquoi devenir coach ?"
      subtitle="360 ou Coup de pouce, nos 2 modes d’engagements ont de multiples bénéfices pour nos coachs aussi !"
      content={content}
    />
  );
};
