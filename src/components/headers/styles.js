import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from '../../constants/styles';

export const StyledConnectedItem = styled.li`
  display: none;
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    display: list-item;
    border-right: 1px solid ${COLORS.lightgray};
    position: relative;
    &.active {
      border-bottom: solid #f55f24 4px;
    }
    .icon-span {
      color: black;
    }
    .name-span {
      text-transform: none;
      font-size: 1rem;
      color: black;
      font-weight: 500;
    }

    &.hasSubMenu {
      .subMenu-container {
        max-height: 0;
        opacity: 0;
        transition: 0.3s ease-in-out;
      }
      &:hover {
        .subMenu-container {
          max-height: 1000px;
          opacity: 1;
        }
      }
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
