import React from 'react';
import { DropdownContext } from './Dropdown.context';
import {
  StyledDropdownToggleButton,
  StyledDropdownToggleContainer,
} from './Dropdown.styles';

interface DropdownToggleProps {
  children: React.ReactNode;
  /**
   * Renders the toggle as a real `<button>`: reachable with the keyboard and
   * announced as a menu button. Leave it off when the children already are
   * interactive elements (a button, a link): a button cannot contain one.
   */
  asButton?: boolean;
  id?: string;
  ariaLabel?: string;
}

export const DropdownToggle = ({
  children,
  asButton = false,
  id,
  ariaLabel,
}: DropdownToggleProps) => {
  const { toggleDropdown, isOpen } = React.useContext(DropdownContext);

  if (asButton) {
    return (
      <StyledDropdownToggleButton
        type="button"
        id={id}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        {children}
      </StyledDropdownToggleButton>
    );
  }

  return (
    <StyledDropdownToggleContainer onClick={toggleDropdown}>
      {children}
    </StyledDropdownToggleContainer>
  );
};
