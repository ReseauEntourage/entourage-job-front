import React from 'react';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdownMenuItem } from './Dropdown.styles';

type DropdownItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const DropdownItem = ({ children, onClick }: DropdownItemProps) => {
  const { closeDropdown } = React.useContext(DropdownContext);

  const handleClick = () => {
    if (onClick) onClick();
    closeDropdown();
  };

  return (
    <StyledDropdownMenuItem onClick={handleClick} className="dropdown-item">
      {children}
    </StyledDropdownMenuItem>
  );
};
