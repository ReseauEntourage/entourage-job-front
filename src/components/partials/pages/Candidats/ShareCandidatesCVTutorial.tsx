import React from 'react';
import { MultipleCTA } from 'src/components/partials/utils/MultipleCTA';
import { Section } from 'src/components/utils';

const datas = [
  {
    img: '/static/img/orienter-cv.png',
    title: 'Découvrez les profils des candidat(e)s',
  },
  {
    img: '/static/img/orienter-diffuser.png',
    title: 'Partagez le CV des candidat(e)s',
  },
  {
    img: '/static/img/orienter-handshake.jpg',
    title: 'Laissez la puissance du réseau opérer',
  },
];

export const ShareCandidatesCVTutorial = () => {
  return (
    <Section style="muted" id="tutorial">
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        <span className="uk-text-primary">3 clics</span> pour booster la
        visibilité des candidat(e)s
      </h2>
      <MultipleCTA data={datas} showHorizontalDividers showNumbers />
    </Section>
  );
};
