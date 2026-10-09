import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

// Shadow of the cards of the help groups pages (no border with it)
const MOBILE = `@media (max-width: ${BREAKPOINTS.desktop}px)`;

// The back link sits close to the discussion: the start of the replies
// must fit in the height of a small screen
export const StyledHelpGroupDiscussion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledHelpGroupDiscussionColumns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  align-items: start;
  gap: 32px;

  ${MOBILE} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const StyledHelpGroupDiscussionMain = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

// The discussion is part of the page flow: the page is the only scroll
export const StyledDiscussionPanel = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
`;

export const StyledThread = styled.div`
  display: flex;
  flex-direction: column;
`;

// The original message: the card heading the discussion
export const StyledOriginalMessage = styled.article`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 32px 16px;
  overflow-wrap: anywhere;

  ${MOBILE} {
    gap: 12px;
    padding: 20px 16px;
  }
`;

export const StyledOriginalMessageBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledRepliesSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 32px 8px;
  border-top: 1px solid ${COLORS.extraLightGray};

  ${MOBILE} {
    padding: 12px 16px 8px;
  }
`;

// Replies: a plain list separated by dividers
export const StyledReplies = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledReply = styled.article<{ $isHighlighted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0 -16px;
  padding: 20px 16px;
  border-bottom: 1px solid ${COLORS.extraLightGray};
  border-radius: ${({ $isHighlighted }) => ($isHighlighted ? '8px' : '0')};
  background-color: ${({ $isHighlighted }) =>
    $isHighlighted ? COLORS.hoverBlue : COLORS.transparent};
  overflow-wrap: anywhere;
  scroll-margin-top: 120px;
  transition: background-color 0.6s ease;

  &:last-child {
    border-bottom: none;
  }

  ${MOBILE} {
    padding: 16px;
  }
`;

// Reply area (or the invitation replacing it), at the end of the thread
export const StyledThreadBottom = styled.div`
  border-top: 1px solid ${COLORS.extraLightGray};
  border-radius: 0 0 10px 10px;
  background-color: ${COLORS.white};

  ${MOBILE} {
    border-radius: 0;
  }
`;

export const StyledWriteInvitationContainer = styled.div`
  padding: 16px 32px 20px;

  ${MOBILE} {
    padding: 10px 12px 14px;
  }
`;

// Bottom spacing of the page under the reply area
export const StyledDiscussionEnd = styled.div`
  height: 48px;

  ${MOBILE} {
    height: 0;
  }
`;

// At the bottom of the viewport, so it stays visible while reading above
export const StyledNewReplyPill = styled.button`
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 20;
  padding: 6px 14px;
  border: none;
  border-radius: 16px;
  background-color: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  font-weight: 600;
  white-space: nowrap;
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
