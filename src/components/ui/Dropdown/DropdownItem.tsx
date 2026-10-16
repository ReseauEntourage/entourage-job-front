import React from 'react';
import { Color } from '@/src/constants/styles';
import { useIsDesktop } from '@/src/hooks/utils';
import { TextSize } from '../Text';
import { DropdownContext } from './Dropdown.context';
import {
  StyledDropdownMenuItem,
  StyledDropdownMenuItemContent,
} from './Dropdown.styles';

type DropdownItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  size?: TextSize;
  /** Icon shown before the label, in the same color as the label */
  icon?: React.ReactNode;
  /** Color token of the label and of the icon, kept on hover */
  color?: Color;
};

export const DropdownItem = ({
  children,
  onClick,
  size,
  icon,
  color,
}: DropdownItemProps) => {
  const isDesktop = useIsDesktop();
  const { closeDropdown } = React.useContext(DropdownContext);
  const device = isDesktop ? 'desktop' : 'mobile';

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    closeDropdown();
  };

  // Enter and Space activate the entry, as they do on a native button
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <StyledDropdownMenuItem
      role="menuitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="dropdown-item"
      size={size}
      $device={device}
      $color={color}
    >
      {icon ? (
        <StyledDropdownMenuItemContent>
          {icon}
          {children}
        </StyledDropdownMenuItemContent>
      ) : (
        children
      )}
    </StyledDropdownMenuItem>
  );
};
