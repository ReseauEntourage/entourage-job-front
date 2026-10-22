import React from 'react';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdownMenu } from './Dropdown.styles';

type DropdownMenuProps = {
  children: React.ReactNode;
  openDirection?: 'left' | 'right';
  size?: 'small' | 'large';
};

// Arrow keys move the focus from one entry to the next, looping at the ends
const handleArrowNavigation = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return;
  }
  const items = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')
  );
  if (items.length === 0) {
    return;
  }
  event.preventDefault();
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  const step = event.key === 'ArrowDown' ? 1 : -1;
  const nextIndex =
    currentIndex === -1
      ? step === 1
        ? 0
        : items.length - 1
      : (currentIndex + step + items.length) % items.length;
  items[nextIndex].focus();
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
        <StyledDropdownMenu
          role="menu"
          $openDirection={openDirection}
          size={size}
          onKeyDown={handleArrowNavigation}
        >
          {children}
        </StyledDropdownMenu>
      )}
    </>
  );
};
