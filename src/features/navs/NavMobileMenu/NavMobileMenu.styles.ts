import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/** Space between the bar and the floating menu card */
export const MOBILE_MENU_GAP = 8;

const MOBILE_MENU_BOTTOM_MARGIN = 16;

/**
 * Card that drops down under a mobile bar, shared by the public and the
 * connected menus. `$top` is the distance between the viewport top and the card.
 */
export const StyledMobileMenuPanel = styled.div<{
  $top: number;
  $gap?: number;
}>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1039;
  width: min(1314px, calc(100% - 32px));
  max-height: calc(
    100vh - ${({ $top }) => $top}px - ${MOBILE_MENU_BOTTOM_MARGIN}px
  );
  max-height: calc(
    100dvh - ${({ $top }) => $top}px - ${MOBILE_MENU_BOTTOM_MARGIN}px
  );
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? 16}px;
  padding: 16px;
  background-color: ${COLORS.white};
  border-radius: 20px;
  box-shadow: 0px 5px 20px 0px rgba(38, 125, 140, 0.85);
`;

export const StyledMobileMenuList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const StyledMobileMenuDivider = styled.div<{ $color?: string }>`
  height: 1px;
  background-color: ${({ $color }) => $color ?? COLORS.lightGray};
`;
