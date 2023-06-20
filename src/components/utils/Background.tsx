import React from 'react';
import { UIKIT_BLENDS, UIKIT_STYLES } from 'src/components/variables';
import { addPrefix } from 'src/utils';

interface BackgroundProps {
  children: JSX.Element | JSX.Element[];
  src?: string;
  position?: string;
  blend?: {
    color?: typeof UIKIT_STYLES;
    colorHex?: string;
    mode?: typeof UIKIT_BLENDS;
  };
  fixed?: boolean;
}

export const Background = ({
  src,
  position,
  blend,
  fixed,
  children,
}: BackgroundProps) => {
  let classBuffer = 'uk-background-cover';
  const styleBuffer: { backgroundImage?: string; backgroundColor?: string } =
    {};
  if (position) classBuffer += ` uk-background-${position}`;
  if (blend.mode) classBuffer += ` uk-background-blend-${blend.mode}`;
  if (fixed) classBuffer += ` uk-background-fixed`;
  if (src) {
    styleBuffer.backgroundImage = `url(${addPrefix(src)})`;
  }
  if (blend.color) {
    classBuffer += ` uk-background-${blend.color}`;
  } else if (blend.colorHex) {
    styleBuffer.backgroundColor = blend.colorHex ? blend.colorHex : undefined;
  }
  return (
    <div className={classBuffer} style={styleBuffer}>
      {children}
    </div>
  );
};

Background.defaultProps = {
  position: undefined,
  blend: {},
  fixed: false,
  src: undefined,
};
