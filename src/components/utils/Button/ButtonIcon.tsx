import React from 'react';
import { Button } from './Button';

export interface ButtonIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  dataTestId?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const ButtonIcon = ({
  icon,
  onClick = () => {},
  href,
  dataTestId,
  variant = 'secondary',
}: ButtonIconProps) => {
  return (
    <Button
      href={href}
      onClick={onClick}
      data-testid={dataTestId}
      variant={variant}
    >
      {icon}
    </Button>
  );
};
