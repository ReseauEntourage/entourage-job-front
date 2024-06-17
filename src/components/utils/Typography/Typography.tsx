import React from 'react';
import { StyledTypography, TypographyProps } from './Typography.styles';

export function Typography({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'normal',
  center = false,
  variant = 'normal',
}: TypographyProps) {
  return (
    <StyledTypography
      size={size}
      weight={weight}
      color={color}
      center={center}
      variant={variant}
    >
      {children}
    </StyledTypography>
  );
}
