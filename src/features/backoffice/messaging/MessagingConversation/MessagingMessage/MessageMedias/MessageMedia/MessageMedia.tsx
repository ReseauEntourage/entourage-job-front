import React, { useMemo } from 'react';
import { LegacyImg, Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { Spinner } from '@/src/components/ui/Spinner';
import { Media } from 'src/api/types';
import { COLORS } from 'src/constants/styles';
import {
  StyledMessageMedia,
  StyledPreviewerContainer,
} from './MessageMedia.styles';

const FILENAME_MAX_LENGTH = 20;

export interface MessageMediaProps {
  media: Media;
  mode?: 'single' | 'multiple';
}

export const MessageMedia = ({ media, mode = 'single' }: MessageMediaProps) => {
  const formattedFileName = useMemo(() => {
    const fileNameWithoutExtension = media.name
      .split('.')
      .slice(0, -1)
      .join('.');
    const fileExtension = media.name.split('.').pop();
    const ellipsedFileName =
      fileNameWithoutExtension.length > FILENAME_MAX_LENGTH
        ? `${fileNameWithoutExtension.slice(0, FILENAME_MAX_LENGTH)}...`
        : fileNameWithoutExtension;

    return `${ellipsedFileName}.${fileExtension}`;
  }, [media]);

  const icon = media.mimeType.includes('image') ? 'Image' : 'FileText';

  const openMedia = () => {
    if (media.signedUrl) {
      window.open(media.signedUrl, '_blank');
    }
  };

  const isLoading = !media.signedUrl;

  return mode === 'single' ? (
    <StyledMessageMedia onClick={openMedia}>
      <StyledPreviewerContainer>
        <LegacyImg
          src={media.signedUrl}
          alt={media.name}
          width={500}
          height={150}
          cover
        />
      </StyledPreviewerContainer>
    </StyledMessageMedia>
  ) : (
    <StyledMessageMedia onClick={openMedia}>
      {isLoading ? (
        <Spinner color={COLORS.black} />
      ) : (
        <LucidIcon name={icon} size={30} />
      )}
      <Text size="xsmall">{formattedFileName}</Text>
    </StyledMessageMedia>
  );
};
