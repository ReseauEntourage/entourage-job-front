import React from 'react';
import { StyledText } from './Text.styles';
import { TextProps } from './Text.types';

export const sizesPx: { [K in NonNullable<TextProps['size']>]: number } = {
  small: 12,
  normal: 14,
  large: 16,
  xlarge: 18,
  xxlarge: 20,
};

export function Text({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'black',
  center = false,
  variant = 'normal',
}: TextProps) {
  return (
    <StyledText
      size={sizesPx[size] || size}
      weight={weight}
      color={color}
      center={center}
      variant={variant}
    >
      {children}
    </StyledText>
  );
}
