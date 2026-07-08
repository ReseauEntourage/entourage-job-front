import React from 'react';
import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

const StyledPill = styled.div<{ $width: string }>`
  height: 10px;
  width: ${({ $width }) => $width};
  border-radius: 12px;
  background: ${COLORS.extraLightGray};
  background-size: 200px 100%;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
`;

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
