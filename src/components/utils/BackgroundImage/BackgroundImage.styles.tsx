import styled from 'styled-components';

const BACKGROUND_IMAGE_HEIGHT = 240;

export const StyledBackground = styled.section`
  &.top-banner {
    .banner-container {
      max-height: ${BACKGROUND_IMAGE_HEIGHT}px;
      height: ${BACKGROUND_IMAGE_HEIGHT}px;
      .banner {
        height: ${BACKGROUND_IMAGE_HEIGHT}px;
        max-height: ${BACKGROUND_IMAGE_HEIGHT}px;
      }
      &.hasCta {
        max-height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
        height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
        .banner {
          height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
          max-height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
        }
      }
    }
  }
  .banner-container {
    width: 100%;
    position: relative;
    max-height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
    height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
    overflow: hidden;
    .banner {
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
      max-height: ${BACKGROUND_IMAGE_HEIGHT + 60}px;
      overflow: hidden;
      width: 100vw;
      display: block;
    }
    .banner-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      width: 100%;
      display: flex;
    }
    &.mobile-banner-container {
      height: ${(props) => {
        return props.mobileHeight ? `${props.mobileHeight}px` : '199px';
      }};
      max-height: ${(props) => {
        return props.mobileHeight ? `${props.mobileHeight}px` : '199px';
      }};
      .banner {
        height: ${(props) => {
          return props.mobileHeight ? `${props.mobileHeight}px` : '199px';
        }};
        max-height: ${(props) => {
          return props.mobileHeight ? `${props.mobileHeight}px` : '199px';
        }};
      }
    }
  }
`;
