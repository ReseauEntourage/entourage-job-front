import React from 'react';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdownToggleContainer } from './Dropdown.styles';

export interface DropdownToggleProps {
  children: React.ReactNode;
}

export const DropdownToggle = ({ children }: DropdownToggleProps) => {
  const { toggleDropdown } = React.useContext(DropdownContext);

  return (
    <StyledDropdownToggleContainer onClick={toggleDropdown}>
      {children}
    </StyledDropdownToggleContainer>
  );
};
