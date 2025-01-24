import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledText } from './Text.styles';
import { TextProps } from './Text.types';

export function Text({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'black',
  center = false,
  variant = 'normal',
}: TextProps) {
  const isDesktop = useIsDesktop();

  return (
    <StyledText
      size={size}
      weight={weight}
      color={color}
      center={center}
      variant={variant}
      mobile={!isDesktop}
    >
      {children}
    </StyledText>
  );
}
