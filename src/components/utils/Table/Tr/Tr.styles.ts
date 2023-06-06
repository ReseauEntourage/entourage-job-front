import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTr = styled.tr`
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

export const StyledTrMobile = styled.tr`
  font-size: 14px;

  .bold {
    font-weight: 700;
  }

  .line {
    padding: 8px;
    display: flex;
    flex-direction: row;
    border-right: 1px solid ${COLORS.gray};
    border-left: 1px solid ${COLORS.gray};
  }

  .line:first-of-type {
    border-top: 1px solid ${COLORS.gray};
    border-bottom: 1px solid ${COLORS.gray};
    border-radius: 5px 5px 0 0;
    padding: 8px 16px;

    > * {
      flex-direction: row;
      align-items: center;
    }
  }

  .line:last-of-type {
    border-bottom: 1px solid ${COLORS.gray};
    border-radius: 0 0 5px 5px;
    margin-bottom: 15px;
  }

  .line > * {
    flex: 1;
  }

  ${({ selected }) => {
    return (
      selected &&
      css`
        .line {
          border-right: 1px solid ${COLORS.primaryOrange};
          border-left: 1px solid ${COLORS.primaryOrange};
          background-color: ${COLORS.hoverOrange} !important;
        }
        .line:first-of-type {
          border-top: 1px solid ${COLORS.primaryOrange};
        }
        .line:last-of-type {
          border-bottom: 1px solid ${COLORS.primaryOrange};
        }
      `
    );
  }}
`;
