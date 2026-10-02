import React from 'react';
import { ButtonIcon } from '@/src/components/ui';
import { Color, COLORS } from '@/src/constants/styles';
import { LucidIcon } from './Icons/LucidIcon';

interface HamburgerProps {
  onClick: () => void;
  color?: Color;
  isOpen?: boolean;
  dataTestId?: string;
}

export const Hamburger = ({
  onClick,
  color = 'white',
  isOpen = false,
  dataTestId,
}: HamburgerProps) => {
  return (
    <ButtonIcon
      onClick={onClick}
      icon={
        <LucidIcon
          name={isOpen ? 'X' : 'Menu'}
          size={30}
          color={COLORS[color]}
        />
      }
      variant="text"
      dataTestId={dataTestId}
    />
  );
};
