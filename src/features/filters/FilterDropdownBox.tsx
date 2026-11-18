import React, { useEffect, useRef, useState } from 'react';
import { StyledFilterDropdownBox } from './FiltersDropdowns/FiltersDropdowns.styles';

interface FilterDropdownBoxProps {
  /** Content of the box, given the open state and the function that toggles it. */
  children: (state: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
  fullWidth?: boolean;
  dataTestId?: string;
}

/**
 * Box holding a toggle and a panel opened by a click on it. It only keeps the open state:
 * it closes on a click anywhere else (which includes the toggle of another dropdown) and on
 * Escape. The panel is positioned against the box.
 */
export const FilterDropdownBox = ({
  children,
  fullWidth = false,
  dataTestId,
}: FilterDropdownBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('click', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  return (
    <StyledFilterDropdownBox
      ref={boxRef}
      $fullWidth={fullWidth}
      data-testid={dataTestId}
    >
      {children({ isOpen, toggle: () => setIsOpen((open) => !open) })}
    </StyledFilterDropdownBox>
  );
};
