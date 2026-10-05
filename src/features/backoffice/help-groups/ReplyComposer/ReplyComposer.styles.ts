import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReplyComposer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${COLORS.gray};
  background-color: ${COLORS.white};
`;

export const StyledReplyComposerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
