import React from 'react';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdownMenu } from './Dropdown.styles';

type DropdownMenuProps = {
  children: React.ReactNode;
  openDirection?: 'left' | 'right';
  size?: 'small' | 'large';
};

export const DropdownMenu = ({
  children,
  openDirection = 'right',
  size = 'small',
}: DropdownMenuProps) => {
  const { isOpen } = React.useContext(DropdownContext);

  return (
    <>
      {isOpen && (
        <StyledDropdownMenu openDirection={openDirection} size={size}>
          {children}
        </StyledDropdownMenu>
      )}
    </>
  );
};
