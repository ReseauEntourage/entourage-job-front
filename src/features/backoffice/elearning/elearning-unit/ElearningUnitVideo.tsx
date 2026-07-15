import { useMemo, useRef } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { Text } from '@/src/components/ui';

import {
  StyledElearningUnitContent,
  StyledElearningUnitVideoFrame,
} from './ElearningUnit.styles';

interface ElearningUnitVideoProps {
  title: string;
  videoUrl?: string | null;
  onPlay?: () => void;
}

export const ElearningUnitVideo = ({
  title,
  videoUrl,
  onPlay = () => {},
}: ElearningUnitVideoProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
    // Shorts (9:16) sont beaucoup plus hauts : on conserve le ratio mais on limite la largeur via CSS.
    if (isShortsUrl) {
      return { aspectWidth: 9, aspectHeight: 16 };
    }

    return { aspectWidth: 16, aspectHeight: 9 };
  }, [isShortsUrl]);

  return (
    <StyledElearningUnitContent noPadding>
      {youtubeVideoId ? (
        <StyledElearningUnitVideoFrame isShorts={isShortsUrl}>
          <div className="video-inner">
            <LiteYouTubeEmbed
              ref={iframeRef}
              key={youtubeVideoId}
              id={youtubeVideoId}
              title={title}
              aspectWidth={aspectWidth}
              aspectHeight={aspectHeight}
              poster="maxresdefault"
              enableJsApi={true}
              onPlay={onPlay}
              style={{
                aspectRatio: `${aspectWidth} / ${aspectHeight}`,
              }}
            />
          </div>
        </StyledElearningUnitVideoFrame>
      ) : (
        <Text>Vidéo non disponible</Text>
      )}
    </StyledElearningUnitContent>
  );
};
