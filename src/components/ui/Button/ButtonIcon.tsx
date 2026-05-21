import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { Button } from './Button';
import { ButtonSize, ButtonVariant } from './Button.types';
import { BUTTON_SIZES } from './button.constants';

export type ButtonIconVariant = 'text' | 'default' | 'secondary' | 'primary';

export interface ButtonIconProps {
  icon: React.ReactNode;
  onClick?: (e: Event) => Promise<void> | void;
  href?: string;
  dataTestId?: string;
  newTab?: boolean;
  disabled?: boolean;
  color?: string;
  size?: ButtonSize;
  variant?: ButtonIconVariant;
}

const BUTTON_ICON_VARIANT_MAP: Record<ButtonIconVariant, ButtonVariant> = {
  text: 'text',
  default: 'default',
  secondary: 'secondary',
  primary: 'primary',
};

export const ButtonIcon = ({
  icon,
  onClick = () => {},
  color = COLORS.primaryBlue,
  href,
  dataTestId,
  newTab,
  size = 'medium',
  disabled = false,
  variant = 'default',
}: ButtonIconProps) => {
  const iconSize = BUTTON_SIZES[size].iconSize;
  const formattedIcon = React.cloneElement(
    icon as React.ReactElement<{
      color: string;
      size: number;
      width: number;
      height: number;
    }>,
    { color, size: iconSize, width: iconSize, height: iconSize }
  );
  return (
    <Button
      href={href}
      rounded="circle"
      onClick={onClick}
      dataTestId={dataTestId}
      newTab={newTab}
      disabled={disabled}
      variant={BUTTON_ICON_VARIANT_MAP[variant]}
      size={size}
    >
      {formattedIcon}
    </Button>
  );
};
