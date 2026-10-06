import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportContext = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledReportContextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledReportMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 600px;
  overflow-y: auto;
  padding: 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 12px;
`;

export const StyledReportMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${COLORS.hoverBlue};
`;

export const StyledReportMessageHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledReportQuote = styled.div`
  padding: 12px 16px;
  border-left: 3px solid ${COLORS.primaryBlue};
  background-color: ${COLORS.hoverBlue};
  white-space: pre-wrap;
`;

export const StyledReportState = styled.div``;
