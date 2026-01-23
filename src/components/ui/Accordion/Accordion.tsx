import React from 'react';
import { LucidIcon } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { COLORS } from '@/src/constants/styles';
import {
  StyledAccordion,
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionHeaderContent,
  StyledAccordionOpenIcon,
} from './Accordion.styles';

export type AccordionVariant = 'simple' | 'default';

export interface AccordionProps {
  headerContent: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: AccordionVariant;
}

export const Accordion = ({
  headerContent,
  children,
  defaultOpen,
  variant = 'default',
}: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(!!defaultOpen);

  return (
    <StyledAccordion $variant={variant}>
      <StyledAccordionHeader
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
        $variant={variant}
      >
        <StyledAccordionHeaderContent>
          {headerContent}
        </StyledAccordionHeaderContent>
        <StyledAccordionOpenIcon $isOpen={isOpen} $variant={variant}>
          <LucidIcon name={isOpen ? 'ChevronUp' : 'ChevronDown'} />
        </StyledAccordionOpenIcon>
      </StyledAccordionHeader>
      {isOpen && (
        <StyledAccordionContent $variant={variant}>
          {children}
        </StyledAccordionContent>
      )}
    </StyledAccordion>
  );
};
