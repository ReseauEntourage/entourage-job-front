import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

export const StyledRegistrationContainer = styled.div`
  background-color: ${COLORS.lightGray};
  width: 100%;
  min-height: calc(100vh - ${HEIGHTS.HEADER}px);

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
  }
`;

export const StyledRegistrationFooter = styled.div`
  margin-top: 32px;
`;

export const StyledRegistrationSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

export const StyledRegistrationSubtitle = styled.div`
  margin-bottom: 32px;
`;
