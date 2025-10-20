import React from 'react';
import { useIsDesktop } from '@/src/hooks/utils';
import { TextSize } from '../Text';
import { DropdownContext } from './Dropdown.context';
import { StyledDropdownMenuItem } from './Dropdown.styles';

type DropdownItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  size?: TextSize;
};

export const DropdownItem = ({
  children,
  onClick,
  size,
}: DropdownItemProps) => {
  const isDesktop = useIsDesktop();
  const { closeDropdown } = React.useContext(DropdownContext);
  const device = isDesktop ? 'desktop' : 'mobile';

  const handleClick = () => {
    if (onClick) onClick();
    closeDropdown();
  };

  return (
    <StyledDropdownMenuItem
      onClick={handleClick}
      className="dropdown-item"
      size={size}
      device={device}
    >
      {children}
    </StyledDropdownMenuItem>
  );
};
