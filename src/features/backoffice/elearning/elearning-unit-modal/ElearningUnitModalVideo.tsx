import { useMemo } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Text } from '@/src/components/ui';

import {
  StyledElearningUnitModalContent,
  StyledElearningUnitModalVideoFrame,
} from './ElearningUnitModal.styles';

export interface ElearningUnitModalVideoProps {
  title: string;
  videoUrl?: string | null;
}

export const ElearningUnitModalVideo = ({
  title,
  videoUrl,
}: ElearningUnitModalVideoProps) => {
  const isShortsUrl = useMemo(() => {
    if (!videoUrl) {
      return false;
    }
    return videoUrl.includes('shorts/');
  }, [videoUrl]);

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

  const { aspectWidth, aspectHeight } = useMemo(() => {
    // Shorts (9:16) sont beaucoup plus hauts : on conserve le ratio mais on limite la hauteur via CSS.
    if (isShortsUrl) {
      return { aspectWidth: 9, aspectHeight: 16 };
    }

    return { aspectWidth: 16, aspectHeight: 9 };
  }, [isShortsUrl]);

  const maxWidthRatio = useMemo(
    () => aspectWidth / aspectHeight,
    [aspectWidth, aspectHeight]
  );

  return (
    <StyledElearningUnitModalContent noPadding>
      {youtubeVideoId ? (
        <StyledElearningUnitModalVideoFrame maxWidthRatio={maxWidthRatio}>
          <div className="video-inner">
            <LiteYouTubeEmbed
              id={youtubeVideoId}
              title={title}
              aspectWidth={aspectWidth}
              aspectHeight={aspectHeight}
              poster="maxresdefault"
            />
          </div>
        </StyledElearningUnitModalVideoFrame>
      ) : (
        <Text>Vidéo non disponible</Text>
      )}
    </StyledElearningUnitModalContent>
  );
};
