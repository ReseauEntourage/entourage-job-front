import React from 'react';
import { StyledButtonIcon } from './ButtonIcon.styles';

export interface ButtonIconProps {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: () => void;
  href?: string;
  dataTestId?: string;
  newTab?: boolean;
  color?: string;
}

export const ButtonIcon = ({
  icon,
  onClick = () => {},
  color = 'primaryBlue',
  href,
  tooltip,
  dataTestId,
  newTab,
}: ButtonIconProps) => {
  return (
    <StyledButtonIcon
      href={href}
      data-uk-tooltip={tooltip}
      onClick={onClick}
      data-testid={dataTestId}
      target={newTab ? '_blank' : ''}
      rel="noreferrer"
      color={color}
    >
      {icon}
    </StyledButtonIcon>
  );
};
