import React from 'react';
import UIkit from 'uikit';
import { ButtonIcon } from 'src/components/utils/ButtonIcon/ButtonIcon';
import { COLORS } from 'src/constants/styles';
import { LucidIcon } from './Icons/LucidIcon';

interface HamburgerProps {
  targetId: string;
}

export const Hamburger = ({ targetId }: HamburgerProps) => {
  return (
    <ButtonIcon
      onClick={() => {
        UIkit.offcanvas(`#${targetId}`).show();
      }}
      icon={<LucidIcon name="Menu" size={30} color={COLORS.white} />}
    />
  );
};
