import { css, styled } from 'styled-components';
import { SimpleLink } from '@/src/components/ui';
import { StyledNav } from '@/src/components/ui/Navbar/Nav/Nav.styles';
import { Color, COLORS } from '@/src/constants/styles';

export const StyledConnectedItem = styled.li<{ color: Color }>`
  display: list-item;
  position: relative;
  text-align: center;
  transition: 0.1s ease-in-out;
  transition-property: color, background-color, opacity;
  & > a {
    border-bottom: solid transparent 4px;
  }
  &.active > a {
    border-bottom: solid ${COLORS.primaryBlue} 4px;
  }
  .icon-span {
    color: ${({ color }) => {
      return COLORS[color] || COLORS.black;
    }};
    display: flex;
    align-items: center;
  }
  .name-span {
    text-transform: none;
    font-size: 1rem;
    color: ${({ color }) => {
      return COLORS[color] || COLORS.black;
    }};
  }

  &.hasSubMenu {
    .subMenu-container {
      max-height: 0;
      visibility: hidden;
      transition: 0.3s ease-in-out;
    }
    .menu-link:hover ~ .subMenu-container,
    .subMenu-container:hover {
      max-height: 1000px;
      visibility: visible;
    }
  }
  & > a:hover {
    opacity: 0.6;
  }
`;

export const StyledConnectedItemMobile = styled.li`
  &.hasSubMenu {
    flex-direction: column;
    height: unset;
    align-items: flex-start;
  }
`;

// Count of a menu entry over its icon, e.g. the reports badge on the cog
export const StyledNavIconBadgeContainer = styled.div`
  position: relative;
`;

export const StyledNavIconBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: ${COLORS.lightRed};
  border-radius: 8px;
  color: ${COLORS.white};
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const StyledNavDropdownItemContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

// Content of the account menu toggle: the photo and the arrow, centered in
// the header height
export const StyledNavAccountToggle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 80px;
  padding: 0 16px;
`;

/** Tabs of the connected navbar: a row of links, as tall as the header. */
export const StyledConnectedNav = styled(StyledNav)`
  list-style: none;

  > li > a {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    min-height: 80px;
    padding: 0 15px;
    font-size: 0.875rem;
    font-family: Poppins, sans-serif;
    text-decoration: none;
    color: ${COLORS.mutedText};
    text-transform: uppercase;
    transition: 0.1s ease-in-out;
    transition-property: color, background-color;
  }

  > li:hover > a,
  > li > a:focus {
    color: ${COLORS.black};
    outline: none;
  }

  > li > a:active {
    color: ${COLORS.navActive};
  }
`;

const menuLink = css`
  display: flex;
  align-items: center;
`;

/** Tab with a link (router link or plain anchor). */
export const StyledMenuLink = styled(SimpleLink)`
  ${menuLink}
`;

export const StyledMenuAnchor = styled.a`
  ${menuLink}
`;

export const StyledMenuIcon = styled.span`
  margin-right: 10px !important;
`;

/** Right part of the navbar: its entries are centered on the header. */
export const StyledNavRightItems = styled.div`
  display: flex;
  align-items: center;
`;
