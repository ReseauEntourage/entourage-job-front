import React from 'react';
import PropTypes from 'prop-types';
import { StyledNav, StyledNavItem } from './Nav.styles';

const Nav = ({ items, color }) => {
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
Nav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
  color: PropTypes.string,
};

Nav.defaultProps = {
  color: 'white',
};

export default Nav;
