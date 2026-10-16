import { styled } from 'styled-components';
import { BREAKPOINTS, HEIGHTS } from '@/src/constants/styles';

export const StyledLoadingScreen = styled.div`
  width: 100%;
  height: calc(100vh - ${HEIGHTS.HEADER}px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
  }
`;
