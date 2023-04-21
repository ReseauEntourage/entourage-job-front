import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledRow = styled.tr`
  height: 70px;
  box-sizing: border-box;
  &:nth-child(odd) {
    background-color: #f9f9f9;
  }
  &.selected {
    background-color: ${COLORS.hoverOrange} !important;
    td {
      border-top: 1px solid ${COLORS.primaryOrange};
      border-bottom: 1px solid ${COLORS.primaryOrange};
      &:last-child {
        border-right: 1px solid ${COLORS.primaryOrange};
      }
    }
  }
  td {
    border-top: 1px solid ${COLORS.lightgray};
    border-bottom: 1px solid ${COLORS.lightgray};
    padding: 15px;
    &:last-child {
      border-right: 1px solid ${COLORS.lightgray};
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
    &.name-cell {
      padding-left: 24px;
      border-left: solid 3px
        ${(props) => {
          return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
        }};

      a {
        display: flex;
        align-items: center;
      }
      .profileImage {
        margin-right: 15px;
      }
    }
    &.cv-status-cell {
      padding-left: 24px;
      color: ${COLORS.black};
      position: relative;
      &::before {
        content: '';
        height: 10px;
        width: 10px;
        position: absolute;
        left: 0;
        top: calc(50% - 6px);
        border-radius: 12px;
        background-color: ${(props) => {
          return COLORS.cvStatus[props.cvStatus]?.background || COLORS.white;
        }};
        border: 2px solid
          ${(props) => {
            return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
          }};
      }
    }
    &.hiddenCV-cell {
      color: ${COLORS.black};
      .eye-hidden {
        color: ${COLORS.darkGray};
      }
    }
    .yes {
      color: ${COLORS.yesGreen};
    }
    .no {
      color: ${COLORS.noRed};
    }
  }
`;

export const StyledMobileMember = styled.tr`
  border: 1px solid ${COLORS.gray};
  font-size: 14px;
  .bold {
    font-weight: 700;
  }
  &.selected {
    background-color: ${COLORS.hoverOrange} !important;
    .coach-line,
    .zone-date,
    .member-head,
    .work-cv {
      border-right: 1px solid ${COLORS.primaryOrange};
    }
    .member-head {
      border-top: 1px solid ${COLORS.primaryOrange};
    }
    .line:last-of-type {
      border-bottom: 1px solid ${COLORS.primaryOrange};
    }
  }

  .member-head {
    display: flex;
    padding: 8px 16px;
    flex-direction: row;
    align-items: center;
    border: 1px solid ${COLORS.gray};
    border-radius: 5px 5px 0 0;
    border-left: solid 3px
      ${(props) => {
        return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
      }};
    a {
      color: ${COLORS.black};
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      &:hover {
        color: ${COLORS.darkOrange};
      }
    }
    .profileImage {
      margin-right: 15px;
    }
  }
  .coach-line,
  .zone-date,
  .work-cv {
    border-left: solid 3px
      ${(props) => {
        return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
      }};
    border-right: 1px solid ${COLORS.gray};
    padding: 8px;
  }
  .zone-date,
  .work-cv {
    display: flex;
    flex-direction: row;
    .cell {
      width: 33%;
    }
  }

  .line:last-of-type {
    border-bottom: 1px solid ${COLORS.gray};
    border-radius: 0 0 5px 5px;
    margin-bottom: 15px;
  }
  .work-cv {
    .status-cv {
      position: relative;
      padding-left: 24px;
      &::before {
        content: '';
        height: 10px;
        width: 10px;
        position: absolute;
        left: 0;
        top: calc(50% - 6px);
        border-radius: 12px;
        background-color: ${(props) => {
          return COLORS.cvStatus[props.cvStatus]?.background || COLORS.white;
        }};
        border: 2px solid
          ${(props) => {
            return COLORS.cvStatus[props.cvStatus]?.border || COLORS.white;
          }};
      }
    }
  }

  .cell {
    display: flex;
    flex-direction: column;
    color: ${COLORS.black};
    span.title {
      overflow-wrap: normal;
      margin-bottom: 4px;
      color: ${COLORS.darkGray};
      font-size: 12px;
    }
    a {
      color: ${COLORS.black};
    }
    .eye-hidden {
      color: ${COLORS.darkGray};
    }
  }
`;
