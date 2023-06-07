import dynamic from 'next/dynamic';
import React from 'react';
import UIkit from 'uikit';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
import { UIKIT_SCREENS } from 'src/components/variables';

interface HamburgerProps {
  hidden?: (typeof UIKIT_SCREENS)[keyof typeof UIKIT_SCREENS];
  visible?: (typeof UIKIT_SCREENS)[keyof typeof UIKIT_SCREENS];
  targetId: string;
  light?: boolean;
}

export const Hamburger = ({
  hidden,
  targetId,
  visible,
  light,
}: HamburgerProps) => {
  let classBuffer = '';
  if (hidden) classBuffer += `uk-hidden@${hidden}`;
  if (visible) classBuffer += `uk-visible@${visible}`;
  return (
    <ButtonIcon
      style={
        light
          ? {
              color: 'inherit !important',
            }
          : { color: 'white' }
      }
      className={classBuffer}
      onClick={() => {
        UIkit.offcanvas(`#${targetId}`).show();
      }}
      name="menu"
    />
  );
};

Hamburger.defaultProps = {
  hidden: undefined,
  visible: undefined,
  light: false,
};

export const HamburgerNoSSR = dynamic(
  () => {
    return import('src/components/utils/Hamburger').then(
      (mode) => mode.Hamburger
    );
  },
  {
    ssr: false,
  }
);
