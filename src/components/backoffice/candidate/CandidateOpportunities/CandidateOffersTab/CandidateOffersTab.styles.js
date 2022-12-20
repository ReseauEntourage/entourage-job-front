import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTabsUl = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0;
  margin-bottom: 0;
  li {
    list-style: none;
    width: 20%;
    text-align: center;
    border-bottom: 1px solid ${COLORS.gray};
    padding: 12px 0;
    color: ${COLORS.darkGray};
    div {
      span {
        /* font-weight: 700; */
        font-size: 28px;
      }
      p {
        margin: 8px 0 0;
        font-size: 18px;
      }
    }
    &.active {
      border-bottom: 3px solid ${COLORS.primaryOrange};
      color: ${COLORS.primaryOrange};
      &:hover {
        cursor: default;
        border-bottom: 3px solid ${COLORS.primaryOrange};
        color: ${COLORS.primaryOrange};
      }
    }
    &:hover {
      cursor: pointer;
      color: black;
    }
  }

  &.ul-mobile {
    overflow-x: scroll;
    padding: 12px 0;
    margin: 0;
    li {
      white-space: nowrap;
      display: inline-block;
      width: fit-content;
      font-size: 12px;
      margin: 0 8px 0 0;
      border: 1px solid ${COLORS.darkGray};
      padding: 4px 8px;
      border-radius: 4px;
      a {
        color: ${COLORS.darkGray};
      }
      &.active {
        border: 1px solid ${COLORS.primaryOrange};
        a {
          color: ${COLORS.primaryOrange};
          font-weight: 700;
        }
      }
    }
  }
`;
