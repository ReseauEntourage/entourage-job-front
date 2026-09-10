import { styled } from 'styled-components';
import { COLORS, HEIGHTS } from '@/src/constants/styles';

const MOBILE_MENU_GAP = 8;

export const StyledMobileMenuPanel = styled.div`
  position: fixed;
  top: ${HEIGHTS.PUBLIC_NAV_OFFSET_TOP_MOBILE + HEIGHTS.PUBLIC_NAV_CARD_MOBILE + MOBILE_MENU_GAP}px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1039;
  width: min(1314px, calc(100% - 32px));
  max-height: calc(
    100vh -
      ${HEIGHTS.PUBLIC_NAV_OFFSET_TOP_MOBILE + HEIGHTS.PUBLIC_NAV_CARD_MOBILE + MOBILE_MENU_GAP}px -
      16px
  );
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

export const StyledMobileMenuDivider = styled.div`
  height: 1px;
  background-color: ${COLORS.lightGray};
`;

export const StyledMobileMenuActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  > * {
    width: 100%;
  }

  a,
  button {
    width: 100%;
  }
`;
