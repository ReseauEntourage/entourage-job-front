import styled, { css } from 'styled-components';
import { Td } from 'src/components/utils/Table';
import { COLORS } from 'src/constants/styles';

export const StyledNameCellContainer = styled(Td)`
  padding-left: 24px !important;

  a {
    display: flex;
    align-items: center;
  }
`;

export const StyledMobileOrganization = styled.tr`
  border: 1px solid ${COLORS.gray};
  font-size: 14px;
  .bold {
    font-weight: 700;
  }
  ${({ selected }) => {
    return (
      selected &&
      css`
        background-color: ${COLORS.hoverOrange} !important;
        .coach-line,
        .phone-sex,
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
      `
    );
  }}

  .member-head {
    display: flex;
    padding: 8px 16px;
    flex-direction: row;
    align-items: center;
    border: 1px solid ${COLORS.gray};
    border-radius: 5px 5px 0 0;
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
  .phone-sex,
  .work-cv {
    border-left: solid 1px ${COLORS.gray};
    border-right: 1px solid ${COLORS.gray};
    padding: 8px;
  }

  .phone-sex,
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
