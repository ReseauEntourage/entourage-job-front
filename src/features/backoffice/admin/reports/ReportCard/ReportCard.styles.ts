import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

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

export const StyledReportCardReason = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;
