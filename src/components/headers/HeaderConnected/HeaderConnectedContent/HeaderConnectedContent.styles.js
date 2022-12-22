import styled from 'styled-components';
import { COLORS } from 'src//constants/styles';

export const StyledConnectedItem = styled.li`
  display: list-item;
  border-right: 1px solid ${COLORS.lightgray};
  position: relative;
  border-bottom: solid transparent 4px;
  &.active {
    border-bottom: solid ${COLORS.primaryOrange} 4px;
  }
  .icon-span {
  }
  .name-span {
    text-transform: none;
    font-size: 1rem;
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
`;

export const StyledConnectedItemMobile = styled.li`
  &.hasSubMenu {
    flex-direction: column;
    height: unset;
    align-items: flex-start;
  }
`;
