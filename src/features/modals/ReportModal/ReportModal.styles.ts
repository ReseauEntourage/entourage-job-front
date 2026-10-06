import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
`;

export const StyledReportHelp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${COLORS.hoverBlue};

  a {
    font-weight: 700;
  }
`;

export const StyledReportReferent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledReportError = styled.p`
  margin: 0;
  color: ${COLORS.red};
`;
