import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledAlertFeedbackContainer = styled.div`
  display: flex;
  /* flex: 1; */
  flex-direction: column;
  align-items: start;
  color: ${COLORS.white};
  gap: 10px;
  padding: 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    gap: 15px;
  }
`;

export const StyledAlertFeedbackTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

export const StyledAlertFeedbackDescription = styled.div`
  font-size: 14px;
  font-weight: 400;
`;
