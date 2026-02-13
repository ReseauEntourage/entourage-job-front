import React from 'react';
import { StyledTdMobile, StyledTdMobileTitle } from './Td.styles';

export function TdMobile({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StyledTdMobile className={className}>
      {title && <StyledTdMobileTitle>{title}</StyledTdMobileTitle>}
      {children}
    </StyledTdMobile>
  );
}
