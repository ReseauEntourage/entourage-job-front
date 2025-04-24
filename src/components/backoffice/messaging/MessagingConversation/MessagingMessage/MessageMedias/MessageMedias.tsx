import React from 'react';
import { Media } from 'src/api/types';
import { MessageMedia } from './MessageMedia/MessageMedia';
import { StyledMessageMedias } from './MessageMedias.styles';
import { MessageMediasGrid } from './MessageMediasGrid';

export interface MessageMediasProps {
  medias?: Media[];
}

export const MessageMedias = ({ medias }: MessageMediasProps) => {
  const onlyOneImage =
    medias?.length === 1 && medias[0].mimeType.includes('image');
  const mode: 'single' | 'multiple' = onlyOneImage ? 'single' : 'multiple';

  if (!medias) {
    return null;
  }

  return (
    <StyledMessageMedias>
      {mode === 'single' && medias ? (
        <MessageMedia media={medias[0]} />
      ) : (
        <MessageMediasGrid medias={medias} />
      )}
    </StyledMessageMedias>
  );
};
