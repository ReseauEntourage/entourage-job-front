import React from 'react';
import { StyledContainer, StyledPill } from './PillsSkeleton.styles';

const PILL_WIDTHS = ['80%', '50%', '95%', '25%', '70%', '50%', '80%', '55%'];

interface PillsSkeletonProps {
  count?: number;
}

export const PillsSkeleton = ({ count = 3 }: PillsSkeletonProps) => {
  return (
    <StyledContainer>
      {Array.from({ length: count }).map((_, i) => (
        <StyledPill key={i} $width={PILL_WIDTHS[i % PILL_WIDTHS.length]} />
      ))}
    </StyledContainer>
  );
};
