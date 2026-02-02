import React from 'react';
import { StyledTr } from './Tr.styles';

export function TrDesktop({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
}) {
  return (
    <StyledTr selected={selected} className={className}>
      {children}
    </StyledTr>
  );
}
