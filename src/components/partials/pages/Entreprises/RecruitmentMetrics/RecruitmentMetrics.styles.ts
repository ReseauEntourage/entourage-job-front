import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledRecruitmentMetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledMetricsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 90px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
  }
`;
