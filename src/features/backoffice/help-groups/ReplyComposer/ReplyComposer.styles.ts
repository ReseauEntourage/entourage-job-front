import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

// Laid out in the bottom area of the discussion, which carries the top border
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

// Compact reply area: one line, the viewer's avatar, the field-like button
// and the inactive « Répondre »
export const StyledReplyComposerBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 32px;
  border-radius: inherit;
  background-color: ${COLORS.white};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 10px;
    padding: 10px 12px;
  }
`;

export const StyledReplyComposerActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 12px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    & > button {
      flex: 1;
    }
  }
`;

export const StyledReplyComposerVisibility = styled.div`
  flex: 1 1 280px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${COLORS.darkGray};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-basis: 100%;
  }
`;
