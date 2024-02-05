import React from 'react';
import {
  StyledAvailabilityTagContainer,
  StyledAvailabilityTagDot,
} from './AvailabilityTag.styles';

interface AvailabilityTagProps {
  isAvailable: boolean;
}

export function AvailabilityTag({ isAvailable }: AvailabilityTagProps) {
  return (
    <StyledAvailabilityTagContainer>
      <StyledAvailabilityTagDot isAvailable={isAvailable} />
      {isAvailable ? 'Disponible' : 'Indisponible'}
    </StyledAvailabilityTagContainer>
  );
}
