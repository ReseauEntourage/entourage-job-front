import React from 'react';
import { Section } from '@/src/components/ui';
import {
  StyledCenteredTitleH2,
  StyledPrimary,
} from '@/src/features/partials/common/PageText';
import { MultipleCTA } from '@/src/features/partials/utils/MultipleCTA';

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
      <StyledCenteredTitleH2>
        <StyledPrimary>3 clics</StyledPrimary> pour booster la visibilité des
        candidat(e)s
      </StyledCenteredTitleH2>
      <MultipleCTA data={datas} showHorizontalDividers showNumbers />
    </Section>
  );
};
