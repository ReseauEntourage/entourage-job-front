import styled from 'styled-components';

import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledDetailsProgressBar = styled.div`
  width: 100%;
  margin: 8px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > div {
    flex: 0.24;
    font-size: 12px;
    text-align: center;
    border: 1px solid ${COLORS.gray};
    color: ${COLORS.gray};
    &:first-of-type {
      border-radius: 15px 0px 0px 15px;
    }
    &:last-of-type {
      border-radius: 0px 15px 15px 0px;
    }
    &.fullOrange {
      color: white;
      background-color: ${COLORS.primaryBlue};
      border: 1px solid ${COLORS.primaryBlue};
    }
    &.fullRed {
      color: white;
      background-color: ${COLORS.noRed};
      border: 1px solid ${COLORS.noRed};
    }
    &.fullGreen {
      color: white;
      background-color: ${COLORS.yesGreen};
      border: 1px solid ${COLORS.yesGreen};
    }
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      font-size: 10px;
    }
  }
`;
