import React from 'react';
import UIkit from 'uikit';
import MenuIcon from 'assets/icons/menu.svg';
import { ButtonIcon } from 'src/components/utils/ButtonIcon/ButtonIcon';

interface HamburgerProps {
  targetId: string;
}

export const Hamburger = ({ targetId }: HamburgerProps) => {
  return (
    <ButtonIcon
      onClick={() => {
        UIkit.offcanvas(`#${targetId}`).show();
      }}
      icon={<MenuIcon style={{ color: 'white' }} height={26} width={26} />}
    />
  );
};
