import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, PUBLIC_NAV_SPACE } from '@/src/constants/styles';

const DESKTOP_TOP_GAP = 24;
const MOBILE_TOP_GAP = 16;
const DESKTOP_NAV_SPACE = `${PUBLIC_NAV_SPACE.DESKTOP + DESKTOP_TOP_GAP}px`;
const MOBILE_NAV_SPACE = `${PUBLIC_NAV_SPACE.MOBILE + MOBILE_TOP_GAP}px`;

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
