import React from 'react';
import { StyledText, TextProps } from './Text.styles';

export function Text({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'normal',
}: TextProps) {
  return (
    <StyledText size={size} weight={weight} color={color}>
      {children}
    </StyledText>
  );
}
