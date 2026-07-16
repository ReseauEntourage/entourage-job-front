import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledDashboardRecommendationsList = styled.div`
  width: 100%;
`;

export const StyledRecommendationsHowItWorksWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const StyledSkeletonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
  }
`;
