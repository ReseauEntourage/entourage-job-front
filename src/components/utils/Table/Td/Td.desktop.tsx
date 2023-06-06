import React from 'react';
import { StyledTd } from './Td.styles';

export function TdDesktop({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <StyledTd className={className}>{children}</StyledTd>;
}
