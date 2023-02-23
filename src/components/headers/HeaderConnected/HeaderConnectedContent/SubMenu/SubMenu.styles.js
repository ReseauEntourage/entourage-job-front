import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledSubMenu = styled.ul`
  display: flex;
  flex-direction: column;
  .subMenu-item {
    height: 22px;
    padding: 5px 0 5px 40px;
    color: rgba(255, 255, 255, 0.5);
    .uk-icon {
      display: none;
    }
  }

  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 300px;
    padding: 0;
    background-color: white;
    border: solid 1px ${COLORS.lightgray};
    box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
    .subMenu-item {
      width: 100%;
      display: flex;
      height: unset;
      flex-direction: row;
      justify-content: space-between;
      color: black;
      padding: 12px 24px;
      box-sizing: border-box;
      border-bottom: solid 1px ${COLORS.lightgray};
      &:hover {
        background-color: ${COLORS.hoverOrange};
      }
      .uk-icon {
        display: inline-block;
        margin-right: 10px !important;
      }
      .uk-badge {
        margin-left: 0 !important;
      }
    }
  }
`;
