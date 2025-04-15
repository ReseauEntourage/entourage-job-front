import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { StyledText } from './Text.styles';
import { TextProps } from './Text.types';

export const sizesPx = {
  desktop: {
    small: 12,
    normal: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 20,
  },
  mobile: {
    small: 12,
    normal: 13,
    large: 14,
    xlarge: 16,
    xxlarge: 18,
  },
};

export function Text({
  children,
  size = 'normal',
  weight = 'normal',
  color = 'black',
  center = false,
  variant = 'normal',
  textAlign = 'left',
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
    >
      {children}
    </StyledText>
  );
}
