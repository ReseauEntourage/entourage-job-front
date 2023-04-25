import React from 'react';
import { useIsMobile } from 'src/hooks/utils';
import { StyledFormHeading } from './Heading.styles';

interface HeadingProps {
  id: string;
  title: string;
}
export function Heading({ id, title }: HeadingProps) {
  const isMobile = useIsMobile();
  return (
    <StyledFormHeading id={id} data-testid={id} isMobile={isMobile}>
      {title}
    </StyledFormHeading>
  );
}
