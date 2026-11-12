import { css, styled } from 'styled-components';
import type { SECTION_SIZES, SECTION_STYLES } from '@/src/components/variables';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';
import { lightOnDark } from '@/src/styles/lightOnDark';

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

    &.medium {
      & > .section-container {
        max-width: 1000px;
      }
    }
    &.small {
      & > .section-container {
        max-width: 700px;
      }
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

  &.custom-secondary {
    background-color: #222;
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

  &.custom-blue-bg {
    background: ${COLORS.hoverBlue};
  }
`;

/** Vertical padding of the plain sections, by size: [mobile, from the desktop breakpoint]. */
const SECTION_PADDINGS: Record<SECTION_SIZES | 'default', [number, number]> = {
  default: [40, 70],
  xsmall: [20, 20],
  small: [40, 40],
  medium: [40, 70],
  large: [70, 140],
  xlarge: [140, 210],
};

const sectionPadding = (size: SECTION_SIZES | undefined) => {
  const [mobile, desktop] = SECTION_PADDINGS[size ?? 'default'];
  return css`
    padding-top: ${mobile}px;
    padding-bottom: ${mobile}px;
    @media (min-width: ${BREAKPOINTS.desktop}px) {
      padding-top: ${desktop}px;
      padding-bottom: ${desktop}px;
    }
  `;
};

const sectionBackground = (style: SECTION_STYLES | undefined) => {
  switch (style) {
    case 'default':
      return css`
        background: ${COLORS.white};
      `;
    case 'muted':
    case 'hover-blue':
      return css`
        background: ${COLORS.sectionMuted};
      `;
    case 'primary':
      return css`
        background: ${COLORS.primaryBlue};
        ${lightOnDark}
      `;
    case 'secondary':
      return css`
        background: ${COLORS.extraDarkGray};
        ${lightOnDark}
      `;
    default:
      return undefined;
  }
};

/** Plain section root: vertical padding, background and optional centered text. */
export const StyledSectionRoot = styled.div<{
  $style?: SECTION_STYLES;
  $size?: SECTION_SIZES;
  $textCenter?: boolean;
}>`
  display: flow-root;
  box-sizing: border-box;
  ${({ $size }) => sectionPadding($size)}
  ${({ $style }) => sectionBackground($style)}

  > :last-child {
    margin-bottom: 0;
  }

  ${({ $textCenter }) =>
    $textCenter &&
    css`
      text-align: center !important;
    `}
`;

const CONTAINER_MAX_WIDTHS = {
  small: 900,
  large: 1400,
};

/** Centered content column of a plain section: its width and its side padding. */
export const StyledSectionContainer = styled.div<{
  $container?: 'small' | 'large';
}>`
  display: flow-root;
  box-sizing: content-box;
  max-width: ${({ $container }) =>
    $container ? CONTAINER_MAX_WIDTHS[$container] : 1200}px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 640px) {
    padding-left: 30px;
    padding-right: 30px;
  }

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    padding-left: 40px;
    padding-right: 40px;
  }

  > :last-child {
    margin-bottom: 0;
  }
`;
