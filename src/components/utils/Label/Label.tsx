import React from 'react';
import { StyledLabel, LabelProps } from './Label.styles';

export function Label({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'normal',
  variant = 'normal',
}: LabelProps) {
  return (
    <StyledLabel size={size} weight={weight} color={color} variant={variant}>
      {children}
    </StyledLabel>
  );
}
