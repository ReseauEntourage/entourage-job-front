import React from 'react';
import { DropdownContext } from './Dropdown.context';

type DropdownToggleProps = {
  children: React.ReactNode;
};

export const DropdownToggle = ({ children }: DropdownToggleProps) => {
  const { toggleDropdown } = React.useContext(DropdownContext);

  return <div onClick={toggleDropdown}>{children}</div>;
};
