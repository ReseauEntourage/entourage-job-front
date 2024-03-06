import React from 'react';
import { MultipleCTA } from 'src/components/partials/MultipleCTA';
import { Section } from 'src/components/utils';

const datas = [
  {
    img: '/static/img/illustrations/steps1.png',
    title: 'Découvrez les profils des candidats',
  },
  {
    img: '/static/img/illustrations/steps2.png',
    title: "Partagez le CV d'un candidat",
  },
  {
    img: '/static/img/illustrations/steps3.png',
    title: 'Laissez la puissance du réseau opérer',
  },
];

export const ShareCandidatesCVTutorial = () => {
  return (
    <Section style="muted" id="tutorial">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Entourage Pro en <span className="uk-text-primary">trois</span>
        &nbsp;étapes
      </h2>
      <MultipleCTA data={datas} showHorizontalDividers showNumbers />
    </Section>
  );
};
