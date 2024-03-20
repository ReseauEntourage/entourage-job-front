import React from 'react';
import { Typography, TypographyProps } from 'src/components/utils/Typography';
import { StyledSubtitle } from './Subtitle.styles';

interface SubtitleProps extends TypographyProps {
  center?: boolean;
}

export const Subtitle = ({ children, center, ...restProps }: SubtitleProps) => {
  return (
    <StyledSubtitle center={center}>
      <Typography {...restProps}>{children}</Typography>
    </StyledSubtitle>
  );
};
