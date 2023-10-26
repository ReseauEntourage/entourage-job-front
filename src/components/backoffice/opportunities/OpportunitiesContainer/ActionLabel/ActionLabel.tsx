import React from 'react';
import {
  StyledContainer,
  StyledIconContainer,
  StyledLabelContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel.styles';

interface ActionLabelProps {
  color: 'yellow' | 'primaryOrange';
  icon?: JSX.Element;
  label: string;
  disabled?: boolean;
  hoverAnimation?: boolean;
  fill?: boolean;
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
  fill = false,
}: ActionLabelProps) => {
  return (
    <StyledContainer
      fill={fill}
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
