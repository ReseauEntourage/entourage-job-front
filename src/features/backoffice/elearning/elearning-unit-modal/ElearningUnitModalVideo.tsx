import { useMemo } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Text } from '@/src/components/ui';

import { StyledElearningUnitModalContent } from './ElearningUnitModal.styles';

export interface ElearningUnitModalVideoProps {
  title: string;
  videoUrl?: string | null;
}

export const ElearningUnitModalVideo = ({
  title,
  videoUrl,
}: ElearningUnitModalVideoProps) => {
  const youtubeVideoId = useMemo(() => {
    if (videoUrl) {
      const parts = videoUrl.split('v=');
      if (parts.length > 1) {
        const idAndParams = parts[1].split('&');
        return idAndParams[0];
      } else {
        const shortParts = videoUrl.split('shorts/');
        if (shortParts.length > 1) {
          return shortParts[1];
        }
      }
      return null;
    }
    return null;
  }, [videoUrl]);

  return (
    <StyledElearningUnitModalContent noPadding>
      {youtubeVideoId ? (
        <LiteYouTubeEmbed
          id={youtubeVideoId}
          title={title}
          aspectWidth={1080}
          aspectHeight={1920}
          poster="maxresdefault"
        />
      ) : (
        <Text>Vidéo non disponible</Text>
      )}
    </StyledElearningUnitModalContent>
  );
};
