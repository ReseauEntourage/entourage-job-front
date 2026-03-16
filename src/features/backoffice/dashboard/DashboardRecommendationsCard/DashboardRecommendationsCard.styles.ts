import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

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

export const StyledRecommendationsBetaText = styled.div`
  margin-right: auto;
`;

export const StyledRecommendationsHowItWorksTooltip = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 300px;
  padding: 14px 16px;
  background: ${COLORS.lightGray};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  font-size: 13px;
  line-height: 1.5;
  color: ${COLORS.black};
  z-index: 10;
`;
