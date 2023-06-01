import React from 'react';
import { StyledTd } from './Table.styles';

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <StyledTd className={className}>{children}</StyledTd>;
}
