import React, { type JSX } from 'react';
import {
  StyledBackground,
  type BackgroundPosition,
} from '@/src/components/ui/Background.styles';
import type {
  BACKGROUND_BLENDS,
  SECTION_STYLES,
} from '@/src/components/variables';
import { addPrefix } from '@/src/utils';

interface BackgroundProps {
  children: JSX.Element | JSX.Element[];
  src?: string;
  position?: BackgroundPosition;
  blend?: {
    color?: SECTION_STYLES;
    colorHex?: string;
    mode?: BACKGROUND_BLENDS;
  };
  fixed?: boolean;
}

export const Background = ({
  src,
  position,
  blend = {},
  fixed = false,
  children,
}: BackgroundProps) => {
  const style: { backgroundImage?: string; backgroundColor?: string } = {};
  if (src) {
    style.backgroundImage = `url(${addPrefix(src)})`;
  }
  // The named color wins over the hex one.
  if (!blend.color && blend.colorHex) {
    style.backgroundColor = blend.colorHex;
  }
  return (
    <StyledBackground
      $position={position}
      $mode={blend.mode}
      $color={blend.color}
      $fixed={fixed}
      style={style}
    >
      {children}
    </StyledBackground>
  );
};
