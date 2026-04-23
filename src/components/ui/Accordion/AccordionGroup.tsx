import React from 'react';
import { StyledAccordionGroup } from './AccordionGroup.styles';

interface AccordionGroupProps {
  children?: React.ReactNode;
}

export const AccordionGroup = ({ children }: AccordionGroupProps) => {
  return <StyledAccordionGroup>{children}</StyledAccordionGroup>;
};
