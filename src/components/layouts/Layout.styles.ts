import { styled } from 'styled-components';
import { BREAKPOINTS, PUBLIC_NAV_SPACE } from '@/src/constants/styles';

export const StyledPublicNavSpacer = styled.div`
  height: ${PUBLIC_NAV_SPACE.DESKTOP}px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    height: ${PUBLIC_NAV_SPACE.MOBILE}px;
  }
`;
