import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportDecision = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledReportDecisionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const StyledReportDeleteForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.extraLightGray};
`;

export const StyledReportDeleteFormFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
`;
