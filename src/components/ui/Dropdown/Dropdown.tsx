import React, { useState, useRef, useEffect } from 'react';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdown } from './Dropdown.styles';
import { DropdownItem } from './DropdownItem';
import { DropdownItemSeparator } from './DropdownItemSeparator';
import { DropdownMenu } from './DropdownMenu';
import { DropdownToggle } from './DropdownToggle';

type DropdownProps = {
  children: React.ReactNode;
};

// First element of the dropdown a keyboard user can land on: the toggle
const FOCUSABLE_TRIGGER_SELECTOR = '[aria-haspopup="menu"], button, a[href]';

const Dropdown = ({ children }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes the menu and hands the focus back to the toggle
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      closeDropdown();
      dropdownRef.current
        ?.querySelector<HTMLElement>(FOCUSABLE_TRIGGER_SELECTOR)
        ?.focus();
    }
  };

  return (
    <DropdownContext.Provider value={{ isOpen, toggleDropdown, closeDropdown }}>
      <StyledDropdown ref={dropdownRef} onKeyDown={handleKeyDown}>
        {children}
      </StyledDropdown>
    </DropdownContext.Provider>
  );
};

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.ItemSeparator = DropdownItemSeparator;
Dropdown.Item = DropdownItem;

export { Dropdown };
