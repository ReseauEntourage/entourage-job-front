import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
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
  onClick,
}: TextProps) {
  const isDesktop = useIsDesktop();
  const device = isDesktop ? 'desktop' : 'mobile';

  return (
    <StyledText
      size={sizesPx[device][size] || size}
      weight={weight}
      color={color}
      center={center}
      variant={variant}
      mobile={!isDesktop}
      textAlign={textAlign}
      underline={underline}
      onClick={onClick}
    >
      {children}
    </StyledText>
  );
}
