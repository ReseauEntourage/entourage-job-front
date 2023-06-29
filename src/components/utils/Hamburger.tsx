import React from 'react';
import UIkit from 'uikit';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
import { UIKIT_SCREENS } from 'src/components/variables';

interface HamburgerProps {
  hidden?: UIKIT_SCREENS;
  visible?: UIKIT_SCREENS;
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
