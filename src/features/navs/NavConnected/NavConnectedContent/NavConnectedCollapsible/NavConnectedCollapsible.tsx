import React, { useId, useState } from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import {
  StyledCollapsible,
  StyledCollapsibleChevron,
  StyledCollapsibleContent,
  StyledCollapsibleHeader,
  StyledCollapsibleToggle,
} from './NavConnectedCollapsible.styles';

interface NavConnectedCollapsibleProps {
  /** Content of the row that toggles the group: label, avatar... */
  header: React.ReactNode;
  /** Shown next to the chevron, so it stays visible while collapsed */
  badge?: React.ReactNode;
  /** The current page is inside the group: it opens by itself and is tinted */
  isActive?: boolean;
  minHeight?: number;
  dataTestId?: string;
  children: React.ReactNode;
}

/**
 * A row of the mobile menu that folds and unfolds its entries on click.
 * It is folded by default, unless the current page is one of its entries.
 */
export const NavConnectedCollapsible = ({
  header,
  badge,
  isActive = false,
  minHeight = 44,
  dataTestId,
  children,
}: NavConnectedCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(isActive);
  const contentId = useId();

  return (
    <StyledCollapsible>
      <StyledCollapsibleToggle
        type="button"
        $active={isActive}
        $minHeight={minHeight}
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-testid={dataTestId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <StyledCollapsibleHeader>{header}</StyledCollapsibleHeader>
        <StyledCollapsibleChevron>
          {badge}
          <LucidIcon
            name={isOpen ? 'ChevronUp' : 'ChevronDown'}
            color={isActive ? COLORS.darkTeal : COLORS.black}
          />
        </StyledCollapsibleChevron>
      </StyledCollapsibleToggle>
      {isOpen && (
        <StyledCollapsibleContent id={contentId}>
          {children}
        </StyledCollapsibleContent>
      )}
    </StyledCollapsible>
  );
};
