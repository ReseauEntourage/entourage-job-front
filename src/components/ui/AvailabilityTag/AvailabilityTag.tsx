import React from 'react';
import {
  StyledAvailabilityTagContainer,
  StyledAvailabilityTagDot,
} from './AvailabilityTag.styles';

interface AvailabilityTagProps {
  isAvailable: boolean;
  onClick?: () => void;
}

export const AvailabilityTag = ({
  isAvailable,
  onClick,
}: AvailabilityTagProps) => {
  return (
    <StyledAvailabilityTagContainer
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <StyledAvailabilityTagDot isAvailable={isAvailable} />
      {isAvailable ? 'Disponible' : 'Indisponible'}
    </StyledAvailabilityTagContainer>
  );
};
