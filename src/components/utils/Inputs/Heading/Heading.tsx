import React from 'react';
import { StyledFormHeading } from './Heading.styles';

interface HeadingProps {
  id: string;
  title: string;
}
export function Heading({ id, title }: HeadingProps) {
  return (
    <StyledFormHeading id={id} data-testid={id}>
      {title}
    </StyledFormHeading>
  );
}
