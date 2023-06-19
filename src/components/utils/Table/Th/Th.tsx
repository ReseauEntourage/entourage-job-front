import React from 'react';
import { useIsMobile } from 'src/hooks/utils';
import { StyledTh } from './Th.styles';

export function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();

  return (
    <StyledTh isMobile={isMobile} className={className}>
      {children}
    </StyledTh>
  );
}
