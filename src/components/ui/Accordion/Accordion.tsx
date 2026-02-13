import React from 'react';
import { LucidIcon } from '@/src/components/ui';
import {
  StyledAccordion,
  StyledAccordionContent,
  StyledAccordionHeader,
  StyledAccordionHeaderContent,
  StyledAccordionOpenIcon,
} from './Accordion.styles';
import { AccordionVariant } from './Accordion.types';

export interface AccordionProps {
  /** Content to display in the accordion header. */
  headerContent: React.ReactNode;
  /** Content to display inside the accordion when it is expanded. */
  children: React.ReactNode;
  /** Whether the accordion is open by default (uncontrolled). */
  defaultOpen?: boolean;
  /** Controlled open state (optional). If provided, the accordion is controlled. */
  isOpen?: boolean;
  /** Called when user toggles the accordion (works for both controlled & uncontrolled). */
  onOpenChange?: (isOpen: boolean) => void;
  variant?: AccordionVariant;
  /**
   * When true, the accordion content stays mounted even when closed.
   * Useful to keep form fields registered (e.g. react-hook-form validation).
   */
  keepContentMounted?: boolean;
}

export const Accordion = ({
  headerContent,
  children,
  defaultOpen,
  isOpen: controlledIsOpen,
  onOpenChange,
  variant = 'default',
  keepContentMounted = false,
}: AccordionProps) => {
  const isControlled = typeof controlledIsOpen === 'boolean';
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(
    !!defaultOpen
  );
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (nextIsOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(nextIsOpen);
    }
    onOpenChange?.(nextIsOpen);
  };

  const shouldRenderContent = isOpen || keepContentMounted;

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
      {shouldRenderContent && (
        <StyledAccordionContent
          $variant={variant}
          hidden={!isOpen}
          aria-hidden={!isOpen}
        >
          {children}
        </StyledAccordionContent>
      )}
    </StyledAccordion>
  );
};
