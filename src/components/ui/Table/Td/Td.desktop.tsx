import React from 'react';
import { StyledTd } from './Td.styles';

export function TdDesktop({
  children,
  className,
  keepButtonPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  // Keeps the padding of the buttons in the cell, for a cell of actions made
  // of `Button` components (by default the cell strips it)
  keepButtonPadding?: boolean;
}) {
  return (
    <StyledTd className={className} $keepButtonPadding={keepButtonPadding}>
      {children}
    </StyledTd>
  );
}
