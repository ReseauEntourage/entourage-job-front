import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledCompanyLeftColumn = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  flex: 2;
  gap: 40px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-width: unset;
    width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledCompanyRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 40px;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    min-width: 400px;
  }
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;
