import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { StyledOrienterBackground } from '../Inscrire/Inscrire.styles';
import { Section } from 'src/components/utils';

interface VideoSectionProps {
  videoId: string;
  coloredBackground?: boolean;
  videoTitle: string;
}

export const VideoSection = ({
  videoId,
  videoTitle,
  coloredBackground,
}: VideoSectionProps) => {
  const content = (
    <Section>
      <LiteYouTubeEmbed
        id={videoId}
        title={videoTitle}
        poster="maxresdefault"
      />
    </Section>
  );

  return coloredBackground ? (
    <StyledOrienterBackground>{content}</StyledOrienterBackground>
  ) : (
    content
  );
};
