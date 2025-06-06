import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { ButtonIcon } from 'src/components/utils';
import { LucidIcon } from './Icons/LucidIcon';

export interface HamburgerProps {
  onClick: () => void;
}

export const Hamburger = ({ onClick }: HamburgerProps) => {
  return (
    <ButtonIcon
      onClick={onClick}
      icon={<LucidIcon name="Menu" size={30} color={COLORS.white} />}
    />
  );
};
