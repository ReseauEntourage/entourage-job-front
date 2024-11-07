import React from 'react';
import {
  StyledContainer,
  StyledIconContainer,
  StyledLabelContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel.styles';

export type ActionLabelColor = 'darkYellow' | 'primaryBlue' | 'green' | 'red';

interface ActionLabelProps {
  color: ActionLabelColor;
  icon?: JSX.Element;
  label: string | React.ReactNode;
  disabled?: boolean;
  hoverAnimation?: boolean;
  onClick?: () => void;
  id?: string;
}

export const ActionLabel = ({
  color,
  label,
  icon,
  onClick,
  id = '',
  disabled = false,
  hoverAnimation = false,
}: ActionLabelProps) => {
  return (
    <StyledContainer
      color={color}
      disabled={disabled}
      hoverAnimation={hoverAnimation}
      onClick={(event) => {
        event.preventDefault();
        if (onClick) onClick();
      }}
      data-testid={id}
    >
      {icon && <StyledIconContainer>{icon}</StyledIconContainer>}
      <StyledLabelContainer className="action-label">
        {label}
      </StyledLabelContainer>
    </StyledContainer>
  );
};
