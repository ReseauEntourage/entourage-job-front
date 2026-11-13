import { css, styled } from 'styled-components';
import type {
  BACKGROUND_BLENDS,
  SECTION_STYLES,
} from '@/src/components/variables';
import { COLORS } from '@/src/constants/styles';

export type BackgroundPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

const POSITIONS: Record<BackgroundPosition, string> = {
  'top-left': '0 0',
  'top-center': '50% 0',
  'top-right': '100% 0',
  'center-left': '0 50%',
  'center-center': '50% 50%',
  'center-right': '100% 50%',
  'bottom-left': '0 100%',
  'bottom-center': '50% 100%',
  'bottom-right': '100% 100%',
};

export const BACKGROUND_COLORS: Partial<Record<SECTION_STYLES, string>> = {
  default: COLORS.white,
  muted: COLORS.sectionMuted,
  primary: COLORS.primaryBlue,
  secondary: COLORS.extraDarkGray,
};

interface StyledBackgroundProps {
  $position?: BackgroundPosition;
  $mode?: BACKGROUND_BLENDS;
  $color?: SECTION_STYLES;
  $fixed?: boolean;
}

/** Picture covering its box, optionally blended with a color. */
export const StyledBackground = styled.div<StyledBackgroundProps>`
  background-size: cover;
  background-position: ${({ $position }) =>
    POSITIONS[$position ?? 'center-center']};
  background-repeat: no-repeat;

  ${({ $mode }) =>
    $mode &&
    css`
      background-blend-mode: ${$mode};
    `}

  ${({ $fixed }) =>
    $fixed &&
    css`
      background-attachment: fixed;
      backface-visibility: hidden;
      @media (pointer: coarse) {
        background-attachment: scroll;
      }
    `}

  ${({ $color }) =>
    $color &&
    BACKGROUND_COLORS[$color] &&
    css`
      background-color: ${BACKGROUND_COLORS[$color]};
    `}
`;
