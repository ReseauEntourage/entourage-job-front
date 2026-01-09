import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export interface ButtonIconProps {
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  dataTestId?: string;
  newTab?: boolean;
  color?: string;
}

const StyledButtonIcon = styled.a`
  color: ${({ color }) => {
    return COLORS[color] || COLORS.primaryBlue;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonIcon = ({
  icon,
  onClick = () => {},
  color = 'primaryBlue',
  href,
  dataTestId,
  newTab,
}: ButtonIconProps) => {
  return (
    <StyledButtonIcon
      href={href}
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
