import React from 'react';
import PropTypes from 'prop-types';
import {
  StyledCenterContainer,
  StyledLeftContainer,
  StyledNavbar,
  StyledRightContainer,
} from './Navbar.styles';

const Navbar = ({ id, left, center, right, sticky, backgroundColor }) => {
  return (
    <StyledNavbar sticky={sticky} id={id} backgroundColor={backgroundColor}>
      <StyledLeftContainer>{left}</StyledLeftContainer>
      <StyledCenterContainer>{center}</StyledCenterContainer>
      <StyledRightContainer>{right}</StyledRightContainer>
    </StyledNavbar>
  );
};

Navbar.propTypes = {
  id: PropTypes.number,
  left: PropTypes.element,
  center: PropTypes.element,
  right: PropTypes.element,
  sticky: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

Navbar.defaultProps = {
  id: undefined,
  left: undefined,
  center: undefined,
  right: undefined,
  sticky: undefined,
  backgroundColor: 'black',
};

export default Navbar;
