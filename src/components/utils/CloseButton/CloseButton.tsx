import React from 'react';
import { Color, COLORS } from '@/src/constants/styles';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledCloseButton } from './CloseButton.styles';

interface CloseButtonProps {
  className?: string;
  onClick?: () => void;
  dataTestId?: string;
  color?: Color;
  size?: number;
}

export const CloseButton = ({
  className,
  onClick,
  dataTestId = '',
  color = 'black',
  size = 25,
}: CloseButtonProps) => {
  return (
    <StyledCloseButton
      className={className}
      type="button"
      aria-label="close"
      onClick={onClick}
      data-testid={dataTestId}
    >
      <LucidIcon name="X" size={size} color={COLORS[color]} />
    </StyledCloseButton>
  );
};
