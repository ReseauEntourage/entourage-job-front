import React from 'react';
import { StyledText } from './Text.styles';
import { TextProps } from './Text.types';

export function Text({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'normal',
  center = false,
  variant = 'normal',
}: TextProps) {
  return (
    <StyledText
      size={size}
      weight={weight}
      color={color}
      center={center}
      variant={variant}
    >
      {children}
    </StyledText>
  );
}
