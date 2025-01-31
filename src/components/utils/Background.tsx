import React, { type JSX } from 'react';
import { UIKIT_BLENDS, UIKIT_STYLES } from 'src/components/variables';
import { addPrefix } from 'src/utils';

interface BackgroundProps {
  children: JSX.Element | JSX.Element[];
  src?: string;
  position?: string;
  blend?: {
    color?: UIKIT_STYLES;
    colorHex?: string;
    mode?: UIKIT_BLENDS;
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
  if (
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    blend.mode
  ) {
    classBuffer += ` uk-background-blend-${
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      blend.mode
    }`;
  }
  if (fixed) classBuffer += ` uk-background-fixed`;
  if (src) {
    styleBuffer.backgroundImage = `url(${addPrefix(src)})`;
  }
  if (
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    blend.color
  ) {
    classBuffer += ` uk-background-${
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      blend.color
    }`;
  } else if (
    // @ts-expect-error after enable TS strict mode. Please, try to fix it
    blend.colorHex
  ) {
    styleBuffer.backgroundColor =
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      blend.colorHex ? blend.colorHex : undefined;
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
