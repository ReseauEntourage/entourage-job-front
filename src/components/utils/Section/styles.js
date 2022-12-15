import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';

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
    padding-top: ${HEIGHTS.SECTION_PADDING}px;
    padding-bottom: ${HEIGHTS.SECTION_PADDING}px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-top: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      padding-bottom: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
    }
  }
  &.custom-primary {
    padding-top: ${HEIGHTS.SECTION_PADDING}px;
    padding-bottom: ${HEIGHTS.SECTION_PADDING}px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-top: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      padding-bottom: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
    }
  }
  &.custom-mobile-darkBG {
    padding-top: ${HEIGHTS.SECTION_PADDING}px;
    padding-bottom: ${HEIGHTS.SECTION_PADDING}px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      background-color: ${COLORS.lightBlack} !important;
    }
  }
  &.custom-fixed {
    display: flex;
    align-items: center;
    position: sticky;
    background-color: ${COLORS.white};
    z-index: 1;
    height: ${HEIGHTS.TABS_HEIGHT - 2 * HEIGHTS.SECTION_PADDING}px;
    top: ${HEIGHTS.HEADER}px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-top: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      padding-bottom: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      height: inherit;
      position: sticky;
      top: ${HEIGHTS.HEADER_MOBILE}px;
      left: 0;
    }

    & > div {
      flex: 1;
      @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
        overflow: hidden;
      }
    }
  }
`;
