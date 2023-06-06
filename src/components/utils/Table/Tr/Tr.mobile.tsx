import React from 'react';
import { StyledTrMobile } from './Tr.styles';

export function TrMobile({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
}) {
  return (
    <StyledTrMobile selected={selected} className={className}>
      {children}
    </StyledTrMobile>
  );
}
