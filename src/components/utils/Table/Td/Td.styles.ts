import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTd = styled.td`
  border-top: 1px solid ${COLORS.lightgray};
  border-bottom: 1px solid ${COLORS.lightgray};
  padding: 15px;

  button {
    padding: 0 !important;
  }

  &:last-child {
    border-right: 1px solid ${COLORS.lightgray};
  }
  &:first-child {
    border-left: 1px solid ${COLORS.lightgray};
    padding-left: 24px;
  }

  .bold {
    font-weight: 700;
  }

  a {
    color: ${COLORS.black};
    &:hover {
      color: ${COLORS.primaryOrange};
    }
  }
`;

export const StyledTdMobile = styled.td`
  display: flex;
  flex-direction: column;
  color: ${COLORS.black};

  .bold {
    font-weight: 700;
  }

  button {
    padding: 0 !important;
  }

  a {
    color: ${COLORS.black};
    &:hover {
      color: ${COLORS.primaryOrange};
    }
  }
`;

export const StyledTdMobileTitle = styled.span`
  overflow-wrap: normal;
  margin-bottom: 4px;
  color: ${COLORS.darkGray};
  font-size: 12px;
`;
