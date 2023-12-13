import React from 'react';
import { StyledSubtitle } from './Subtitle.styles';

interface SubtitleProps {
  text: React.ReactNode;
  center?: boolean;
}

export const Subtitle = ({ text, center }: SubtitleProps) => {
  return <StyledSubtitle center={center}>{text}</StyledSubtitle>;
};
