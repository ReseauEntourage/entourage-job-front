import { styled, css } from 'styled-components';
import { ReportGroupMessageState } from '@/src/api/types';
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

const BANNER_COLORS: {
  [K in ReportGroupMessageState]: ReturnType<typeof css>;
} = {
  HIDDEN: css`
    background-color: ${COLORS.extraLightRed};
    color: ${COLORS.warning};
  `,
  VISIBLE: css`
    background-color: ${COLORS.extraLightGreen};
    color: ${COLORS.mediumGreen};
  `,
  DELETED: css`
    background-color: ${COLORS.extraLightGray};
    color: ${COLORS.darkGray};
  `,
};

// Banner on top of the reported message panel, by message state
export const StyledReportState = styled.div<{
  $state: ReportGroupMessageState;
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  ${({ $state }) => BANNER_COLORS[$state]}
`;

export const StyledReportGroupMessage = styled.div`
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${COLORS.lightGray};
  white-space: pre-wrap;
`;

export const StyledReportGroupMessageBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const StyledReportLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
`;
