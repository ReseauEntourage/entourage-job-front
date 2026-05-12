import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Section } from '@/src/components/ui';
import { CompanyGoal } from '@/src/constants/company';
import { StyledVideoContainer } from './CoachingVideo.styles';

export const CoachingVideo = () => {
  return (
    <Section style="hover-blue">
      <StyledVideoContainer>
        <LiteYouTubeEmbed
          id="puDIh46PQUI"
          title="Témoignages Entourage Pro"
          aspectWidth={1280}
          aspectHeight={515}
          params="rel=0&showinfo=0&iv_load_policy=3"
        />
      </StyledVideoContainer>
    </Section>
  );
};
