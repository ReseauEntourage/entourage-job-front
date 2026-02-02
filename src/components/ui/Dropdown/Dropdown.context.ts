import React from 'react';

export const DropdownContext = React.createContext({
  isOpen: false,
  toggleDropdown: () => {},
  closeDropdown: () => {},
});
