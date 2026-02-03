import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { Button } from './Button';
import { ButtonSize } from './Button.types';

export interface ButtonIconProps {
  icon: React.ReactNode;
  onClick?: (e: Event) => Promise<void> | void;
  href?: string;
  dataTestId?: string;
  newTab?: boolean;
  disabled?: boolean;
  color?: string;
  size?: ButtonSize;
}

export const ButtonIcon = ({
  icon,
  onClick = () => {},
  color = COLORS.primaryBlue,
  href,
  dataTestId,
  newTab,
  size,
  disabled = false,
}: ButtonIconProps) => {
  const formattedIcon = React.cloneElement(
    icon as React.ReactElement<{ color: string }>,
    {
      color,
    }
  );
  return (
    <Button
      href={href}
      rounded="circle"
      onClick={onClick}
      dataTestId={dataTestId}
      newTab={newTab}
      disabled={disabled}
      variant="text"
      size={size}
    >
      {formattedIcon}
    </Button>
  );
};
