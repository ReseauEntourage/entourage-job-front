import React from 'react';
import { ButtonIcon } from '@/src/components/ui';
import { Color, COLORS } from '@/src/constants/styles';
import { LucidIcon } from './Icons/LucidIcon';

interface HamburgerProps {
  onClick: () => void;
  color?: Color;
}

export const Hamburger = ({ onClick, color = 'white' }: HamburgerProps) => {
  return (
    <ButtonIcon
      onClick={onClick}
      icon={<LucidIcon name="Menu" size={30} color={COLORS[color]} />}
      variant="text"
    />
  );
};
