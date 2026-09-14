import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Section } from '@/src/components/ui';
import { StyledVideoContainer } from './SimpleVideoSection.styles';

interface SimpleVideoSectionProps {
  videoId: string;
  videoTitle: string;
  highlighted?: boolean;
  borderRadius?: number;
}

export const SimpleVideoSection = ({
  videoId,
  videoTitle,
  highlighted = false,
  borderRadius = 50,
}: SimpleVideoSectionProps) => {
  return (
    <Section
      className={highlighted ? 'custom-page custom-blue-bg' : 'custom-page'}
    >
      <StyledVideoContainer $borderRadius={borderRadius}>
        <LiteYouTubeEmbed
          id={videoId}
          poster="maxresdefault"
          title={videoTitle}
          aspectWidth={1280}
          aspectHeight={515}
          params="rel=0&showinfo=0&iv_load_policy=3"
        />
      </StyledVideoContainer>
    </Section>
  );
};
