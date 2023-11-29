import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledSection = styled.section`
  > .section-container {
    display: flow-root;
    box-sizing: content-box;
    max-width: 1360px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 15px;
    padding-right: 15px;
    &.flex-center {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  &.custom-header {
    padding-top: ${HEIGHTS.SECTION_PADDING}px;
    padding-bottom: ${HEIGHTS.SECTION_PADDING}px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-top: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      padding-bottom: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
    }
  }
  &.custom-page {
    padding-top: ${HEIGHTS.DEFAULT_SECTION_PADDING}px;
    padding-bottom: ${HEIGHTS.DEFAULT_SECTION_PADDING}px;
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
      background-color: ${COLORS.black} !important;
    }
  }
  &.custom-fixed {
    display: flex;
    align-items: flex-start;
    position: sticky;
    background-color: ${COLORS.white};
    z-index: 12;
    top: ${HEIGHTS.HEADER}px;
    @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
      padding-top: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      padding-bottom: ${HEIGHTS.SECTION_PADDING_MOBILE}px;
      height: auto !important;
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
