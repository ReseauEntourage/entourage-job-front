import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledHelpGroupDiscussion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledHelpGroupDiscussionColumns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  align-items: start;
  gap: 24px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const StyledHelpGroupDiscussionMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

export const StyledOriginalMessage = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.white};
  overflow-wrap: anywhere;
`;

export const StyledReplies = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledReply = styled.article<{ $isHighlighted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
  border: 1px solid
    ${({ $isHighlighted }) =>
      $isHighlighted ? COLORS.primaryBlue : COLORS.gray};
  border-radius: 16px;
  background-color: ${({ $isHighlighted }) =>
    $isHighlighted ? COLORS.hoverBlue : COLORS.white};
  scroll-margin-top: 120px;
  transition: background-color 0.6s ease;
`;
