import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportTargetPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const StyledReportTargetHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const StyledReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledReportCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 12px;
`;

export const StyledReportCardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
