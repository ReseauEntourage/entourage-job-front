import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Section } from '@/src/components/utils';
import { CompanyGoal } from '@/src/constants/company';
import { StyledVideoContainer } from './EntreprisesVideo.styles';

export interface EntreprisesVideoProps {
  context: CompanyGoal;
}

export const EntreprisesVideo = ({ context }: EntreprisesVideoProps) => {
  const videoByContext = {
    [CompanyGoal.SENSIBILIZE]: 'D3skxi-tC4I',
    [CompanyGoal.RECRUIT]: 'dByylMZ7MNg',
  };

  return (
    <Section>
      <StyledVideoContainer>
        <LiteYouTubeEmbed
          id={videoByContext[context || CompanyGoal.SENSIBILIZE]}
          title="Témoignages Entourage Pro"
          aspectWidth={1280}
          aspectHeight={515}
          params="rel=0&showinfo=0&iv_load_policy=3"
        />
      </StyledVideoContainer>
    </Section>
  );
};
