import { styled } from 'styled-components';
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
