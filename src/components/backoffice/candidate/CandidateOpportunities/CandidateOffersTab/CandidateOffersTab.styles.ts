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
    color: ${COLORS.mediumGray};
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
      border-bottom: 3px solid ${COLORS.primaryBlue};
      color: ${COLORS.primaryBlue};
      &:hover {
        cursor: default;
        border-bottom: 3px solid ${COLORS.primaryBlue};
        color: ${COLORS.primaryBlue};
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
      border: 1px solid ${COLORS.mediumGray};
      padding: 4px 8px;
      border-radius: 4px;
      a {
        color: ${COLORS.mediumGray};
      }
      &.active {
        border: 1px solid ${COLORS.primaryBlue};
        a {
          color: ${COLORS.primaryBlue};
          font-weight: 700;
        }
      }
    }
  }
`;
