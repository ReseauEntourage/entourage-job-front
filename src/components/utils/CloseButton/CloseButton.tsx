import React from 'react';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledCloseButton } from './CloseButton.styles';

interface CloseButtonProps {
  className?: string;
  onClick?: () => void;
  dataTestId?: string;
}

export const CloseButton = ({
  className,
  onClick,
  dataTestId = '',
}: CloseButtonProps) => {
  return (
    <StyledCloseButton
      className={className}
      type="button"
      aria-label="close"
      onClick={onClick}
      data-testid={dataTestId}
    >
      <LucidIcon name="X" size={25} />
    </StyledCloseButton>
  );
};
