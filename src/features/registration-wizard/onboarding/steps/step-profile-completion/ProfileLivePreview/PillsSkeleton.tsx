import React from 'react';
import styled from 'styled-components';

const StyledPill = styled.div<{ $width: string }>`
  height: 24px;
  width: ${({ $width }) => $width};
  border-radius: 12px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200px 100%;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PILL_WIDTHS = ['72px', '88px', '56px', '96px', '64px'];

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
