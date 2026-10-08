import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

// Laid out in the sticky bottom area of the discussion, which carries the
// top border and the shadow
export const StyledReplyComposer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 32px 20px;
  border-radius: inherit;
  background-color: ${COLORS.white};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 6px;
    padding: 10px 12px 14px;
  }
`;

export const StyledReplyComposerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
