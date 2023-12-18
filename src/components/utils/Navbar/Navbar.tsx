import React from 'react';
import {
  StyledNavbar,
  StyledLeftContainer,
  StyledCenterContainer,
  StyledRightContainer,
} from './Navbar.styles';

interface NavbarProps {
  id?: string;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  sticky?: boolean;
  backgroundColor?: string;
}

export const Navbar = ({
  id,
  left,
  center,
  right,
  sticky,
  backgroundColor,
}: NavbarProps) => {
  return (
    <StyledNavbar id={id} sticky={sticky} backgroundColor={backgroundColor}>
      <StyledLeftContainer>{left}</StyledLeftContainer>
      <StyledCenterContainer>{center}</StyledCenterContainer>
      <StyledRightContainer>{right}</StyledRightContainer>
    </StyledNavbar>
  );
};

Navbar.defaultProps = {
  id: null,
  left: null,
  center: null,
  right: null,
  sticky: null,
  backgroundColor: 'black',
};
