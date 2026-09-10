import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

const DESKTOP_TOP_GAP = 24;
const MOBILE_TOP_GAP = 16;
const DESKTOP_NAV_SPACE = `calc(${HEIGHTS.PUBLIC_NAV_OFFSET_TOP}px + ${HEIGHTS.PUBLIC_NAV_CARD}px + ${DESKTOP_TOP_GAP}px)`;
const MOBILE_NAV_SPACE = `calc(${HEIGHTS.PUBLIC_NAV_OFFSET_TOP}px + ${HEIGHTS.PUBLIC_NAV_CARD_MOBILE}px + ${MOBILE_TOP_GAP}px)`;

export const StyledLoginContainer = styled.div`
  background-color: ${COLORS.lightGray};
  width: 100%;
  padding-top: ${DESKTOP_NAV_SPACE};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding-top: ${MOBILE_NAV_SPACE};
    min-height: calc(100vh - ${MOBILE_NAV_SPACE});
  }
`;

export const StyledLoginFooter = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > * {
    &:first-child {
      margin-bottom: 8px;
    }
  }
`;
