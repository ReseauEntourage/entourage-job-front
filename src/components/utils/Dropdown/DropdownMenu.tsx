import React from 'react';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdownMenu } from './Dropdown.styles';

type DropdownMenuProps = {
  children: React.ReactNode;
  openDirection?: 'left' | 'right';
};

export const DropdownMenu = ({
  children,
  openDirection = 'right',
}: DropdownMenuProps) => {
  const { isOpen } = React.useContext(DropdownContext);

  return (
    <>
      {isOpen && (
        <StyledDropdownMenu openDirection={openDirection}>
          {children}
        </StyledDropdownMenu>
      )}
    </>
  );
};
