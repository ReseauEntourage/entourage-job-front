import React from 'react';
import { Media } from 'src/api/types';
import { MessageMedia } from './MessageMedia/MessageMedia';
import { StyledMessageMediasGrid } from './MessageMedias.styles';

export interface MessageMediasGridProps {
  medias: Media[];
}

export const MessageMediasGrid = ({ medias }: MessageMediasGridProps) => {
  return (
    <StyledMessageMediasGrid>
      {medias?.map((media) => (
        <MessageMedia media={media} key={media.id} mode="multiple" />
      ))}
    </StyledMessageMediasGrid>
  );
};
