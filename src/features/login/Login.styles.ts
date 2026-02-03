import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

export const StyledLoginContainer = styled.div`
  background-color: ${COLORS.lightGray};
  width: 100%;
  min-height: calc(100vh - ${HEIGHTS.HEADER}px);

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
  }
`;

export const StyledLoginFooter = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > * {
    :first-child {
      margin-bottom: 8px;
    }
  }
`;
