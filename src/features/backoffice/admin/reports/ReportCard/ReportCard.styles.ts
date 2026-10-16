import { styled } from 'styled-components';
import { COLORS, FONT_WEIGHTS } from '@/src/constants/styles';

export const StyledReportCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid ${COLORS.extraLightGray};
`;

export const StyledReportCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledReportCardIdentity = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-wrap: anywhere;

  > * {
    margin: 0;
  }
`;

export const StyledReportCardName = styled.p`
  font-size: 14px;
  font-weight: ${FONT_WEIGHTS.semibold};
  color: ${COLORS.black};
`;

// Grey pill of the reason, as in the design
export const StyledReportReason = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 20px;
  background-color: ${COLORS.extraLightGray};
  color: ${COLORS.black};
  font-size: 12px;
  font-weight: ${FONT_WEIGHTS.semibold};
`;
