import React from 'react';
import { StyledRow } from './Table.styles';

export function Row({
  children,
  selected,
}: {
  children: React.ReactNode;
  selected?: boolean;
}) {
  return <StyledRow selected={selected}>{children}</StyledRow>;
}
