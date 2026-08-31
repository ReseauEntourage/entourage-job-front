import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const MessagingConversationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const MessagingConversationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 450px;
  flex-grow: 1;
  border: ${COLORS.lightGray} 1px solid;
  box-sizing: border-box;
  height: 100%;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-height: 0;
  }
`;

export const MessagingConversationAIPanel = styled.div`
  width: 40%;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
`;

export const MessagingMessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  overflow-y: auto;
  /* Scroll position when loading older messages is restored manually
     (MessagingConversation.tsx, preservedScrollRef) instead of relying
     on the browser's own scroll anchoring, which proved unreliable here
     (likely due to the loader element toggling right at the boundary of
     what gets anchored). Disabled so it can't apply its own, conflicting
     adjustment on top of ours. */
  overflow-anchor: none;
  padding: 20px;
  box-sizing: border-box;
  align-items: flex-start;
  flex: auto;
`;

/** Sits in the normal flow (not absolutely positioned) so it doesn't
 * overlay the messages beneath it; its own height is accounted for by
 * the manual scroll-position compensation in MessagingConversation.tsx. */
export const MessagingOlderMessagesLoader = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8px 0;
`;
