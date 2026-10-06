import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

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

// Fixed height panel: the original message and the replies scroll together,
// the reply area stays visible at the bottom, on desktop as on mobile
export const StyledDiscussionPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100dvh - ${HEIGHTS.HEADER}px - 140px);
  min-height: 420px;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.extraExtraLightOrange};
  overflow: hidden;
`;

export const StyledThread = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
`;

export const StyledThreadBottom = styled.div`
  position: sticky;
  bottom: 0;
`;

export const StyledNewReplyPill = styled.button`
  position: absolute;
  left: 50%;
  bottom: 140px;
  z-index: 2;
  padding: 6px 14px;
  border: none;
  border-radius: 16px;
  background-color: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  font-weight: 600;
  transform: translateX(-50%);
  cursor: pointer;
`;

export const StyledDiscussionGone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px 0;
  text-align: center;
`;
