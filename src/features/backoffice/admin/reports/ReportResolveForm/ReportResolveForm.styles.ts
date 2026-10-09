import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportResolveForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 12px;

  > :first-child {
    align-self: stretch;
  }
`;

export const StyledReportResolveError = styled.p`
  margin: 0;
  color: ${COLORS.red};
`;
