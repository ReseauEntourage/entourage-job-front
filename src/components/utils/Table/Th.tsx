import React from 'react';
import { StyledTh } from './Table.styles';

export function Th({ children }: { children: React.ReactNode }) {
  return <StyledTh>{children}</StyledTh>;
}
