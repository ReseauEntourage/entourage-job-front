import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledSection = styled.section`
  > .section-container {
    display: flow-root;
    box-sizing: content-box;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
  &.custom-header {
    padding-top: 24px;
    padding-bottom: 24px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-bottom: 12px;
    }
  }
  &.custom-primary {
    padding-top: 24px;
    padding-bottom: 24px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
  &.custom-mobile-darkBG {
    padding-top: 24px;
    padding-bottom: 24px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      background-color: ${COLORS.lightBlack};
    }
  }
  &.custom-mobile-fixed {
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      position: sticky;
      top: 80px;
      left: 0;
    }
  }
`;
