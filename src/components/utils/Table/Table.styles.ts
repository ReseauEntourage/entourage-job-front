import styled, { css } from 'styled-components';
import { COLORS } from '../../../constants/styles';

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 5px;
  vertical-align: middle !important;
  position: relative;
  th {
    position: sticky;
    top: 0;
    padding: 16px 15px;
    text-align: left;
    vertical-align: bottom;
    font-size: 0.875rem;
    font-weight: 400;
    color: #999;
    ${({ isMobile }) => {
      return (
        isMobile &&
        css`
          display: none;
        `
      );
    }}
`;

export const StyledTh = styled.th`
  white-space: nowrap;
`;

export const StyledRow = styled.tr`
  height: 70px;
  box-sizing: border-box;
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
  ${({ selected }) => {
    return (
      selected &&
      css`
        background-color: ${COLORS.hoverOrange} !important;
        td {
          border-top: 1px solid ${COLORS.primaryOrange};
          border-bottom: 1px solid ${COLORS.primaryOrange};
          &:last-child {
            border-right: 1px solid ${COLORS.primaryOrange};
          }
        }
      `
    );
  }}
`;

export const StyledTd = styled.td`
  border-top: 1px solid ${COLORS.lightgray};
  border-bottom: 1px solid ${COLORS.lightgray};
  padding: 15px;
  &:last-child {
    border-right: 1px solid ${COLORS.lightgray};
  }
  &:first-child {
    border-left: 1px solid ${COLORS.lightgray};
  }
  .bold {
    font-weight: 700;
  }
  a {
    color: ${COLORS.black};
    &:hover {
      .bold {
        color: ${COLORS.primaryOrange};
      }
    }
  }
`;
