import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledBackground = styled.section`
  .banner-container {
    width: 100%;
    position: relative;
    max-height: 360px;
    height: 360px;
    overflow: hidden;
    .banner {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      height: 360px;
      max-height: 360px;
      overflow: hidden;
      width: 100vw;
      display: block;
    }
    .banner-content {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100%;
    }
    &.mobile-banner-container {
      height: 199px;
      max-height: 199px;
      .banner {
        height: 199px;
        max-height: 199px;
      }
      @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
        height: 360px;
        max-height: 360px;
        .banner {
          height: 199px;
          max-height: 199px;
        }
      }
    }
  }
`;
