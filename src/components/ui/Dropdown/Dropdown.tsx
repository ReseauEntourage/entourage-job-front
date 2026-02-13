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

  return (
    <DropdownContext.Provider value={{ isOpen, toggleDropdown, closeDropdown }}>
      <StyledDropdown ref={dropdownRef}>{children}</StyledDropdown>
    </DropdownContext.Provider>
  );
};

Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.ItemSeparator = DropdownItemSeparator;
Dropdown.Item = DropdownItem;

export { Dropdown };
