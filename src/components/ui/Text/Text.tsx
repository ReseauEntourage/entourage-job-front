import React from 'react';
import { useIsDesktop } from '@/src/hooks/utils';
import { StyledText } from './Text.styles';
import { TextProps } from './Text.types';
import { sizesPx } from './Text.utils';

export function Text({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'black',
  center = false,
  variant = 'normal',
  textAlign = 'left',
  underline = false,
  uppercase = false,
  onClick,
}: TextProps) {
  const isDesktop = useIsDesktop();
  const device = isDesktop ? 'desktop' : 'mobile';
  const resolvedSize: number =
    typeof size === 'number' ? size : sizesPx[device][size];

  return (
    <StyledText
      size={resolvedSize}
      $weight={weight}
      color={color}
      $center={center}
      $variant={variant}
      $textAlign={textAlign}
      $underline={underline}
      $uppercase={uppercase}
      onClick={onClick}
    >
      {children}
    </StyledText>
  );
}
