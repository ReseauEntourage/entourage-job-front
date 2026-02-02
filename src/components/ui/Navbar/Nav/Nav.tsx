import React from 'react';
import { StyledNav, StyledNavItem } from './Nav.styles';

interface NavProps {
  items: React.ReactNode[];
  color?: string;
}

export const Nav = ({ items, color }: NavProps) => {
  return (
    <StyledNav>
      {items.map((value, index) => {
        return (
          <StyledNavItem color={color} key={index}>
            {value}
          </StyledNavItem>
        );
      })}
    </StyledNav>
  );
};

Nav.defaultProps = {
  color: 'white',
};
