import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledConnectedItem = styled.li`
  display: list-item;
  border-right: 1px solid ${COLORS.lightgray};
  position: relative;

  transition: 0.1s ease-in-out;
  transition-property: color, background-color, opacity;
  & > a {
    border-bottom: solid transparent 4px;
  }
  &.active > a {
    border-bottom: solid ${COLORS.primaryOrange} 4px;
  }
  .icon-span {
    color: ${({ color }) => {
      return COLORS[color] || COLORS.black;
    }};
  }
  .name-span {
    text-transform: none;
    font-size: 1rem;
    color: ${({ color }) => {
      return COLORS[color] || COLORS.black;
    }};
    font-weight: 500;
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
    opacity: 0.5;
  }
`;

export const StyledConnectedItemMobile = styled.li`
  &.hasSubMenu {
    flex-direction: column;
    height: unset;
    align-items: flex-start;
  }
`;
