import { useMemo } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

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
      return videoUrl.split('v=')[1].split('&')[0];
    }
    return null;
  }, [videoUrl]);

  return (
    <StyledElearningUnitModalContent noPadding>
      {youtubeVideoId && (
        <LiteYouTubeEmbed
          id={youtubeVideoId}
          title={title}
          aspectWidth={1920}
          aspectHeight={1080}
          poster="maxresdefault"
        />
      )}
    </StyledElearningUnitModalContent>
  );
};
