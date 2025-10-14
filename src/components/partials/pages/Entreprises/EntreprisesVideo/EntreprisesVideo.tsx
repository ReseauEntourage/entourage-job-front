import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Section } from '@/src/components/utils';
import { StyledVideoContainer } from './EntreprisesVideo.styles';

export const EntreprisesVideo = () => {
  return (
    <Section>
      <StyledVideoContainer>
        <LiteYouTubeEmbed
          id="ztZB4BIBi44"
          title="Témoignages Entourage Pro"
          aspectWidth={1280}
          aspectHeight={515}
          params="rel=0&showinfo=0&iv_load_policy=3"
        />
      </StyledVideoContainer>
    </Section>
  );
};
