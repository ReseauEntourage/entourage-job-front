import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledConnectedItem = styled.li`
  display: list-item;
  border-right: 1px solid ${COLORS.lightGray};
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
