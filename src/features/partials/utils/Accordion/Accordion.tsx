import React from 'react';
import { LucidIcon } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import {
  StyledAccordion,
  StyledAccordionOpenIcon,
  StyledAccordionTitle,
} from './Accordion.styles';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion = ({ title, children, defaultOpen }: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(!!defaultOpen);

  return (
    <StyledAccordion>
      <StyledAccordionTitle onClick={() => setIsOpen(!isOpen)} isOpen={isOpen}>
        <H5 title={title} />
        <StyledAccordionOpenIcon>
          <LucidIcon name={isOpen ? 'ChevronUp' : 'ChevronDown'} />
        </StyledAccordionOpenIcon>
      </StyledAccordionTitle>
      {isOpen && <div>{children}</div>}
    </StyledAccordion>
  );
};
