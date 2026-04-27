import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './messaging.slice';

export const selectNewMessage = (state: RootState) =>
  state.messaging.newMessage;

export const selectIsAIPanelOpen = (state: RootState) =>
  state.messaging.isAIPanelOpen;

export const selectActivePanelView = (state: RootState) =>
  state.messaging.activePanelView;

export const selectConversations = (state: RootState) =>
  state.messaging.conversations;

export const selectGetConversationsStatus = (state: RootState) =>
  state.messaging.getConversations.status;

export const selectSelectedConversation = (state: RootState) =>
  state.messaging.selectedConversation;

export const selectSelectedConversationId = (state: RootState) =>
  state.messaging.selectedConversationId;

export const selectPinnedInfo = (state: RootState) =>
  state.messaging.pinnedInfo;

export const selectHasMessages = (state: RootState) =>
  state.messaging.conversations === null ||
  state.messaging.conversations.length > 0 ||
  state.messaging.selectedConversationId !== null;

export const selectUnseenConversationCount = (state: RootState) =>
  state.messaging.unseenConversationCount;

export const selectConversationParticipantsAreDeleted = (state: RootState) => {
  const selectedConversation = selectSelectedConversation(state);
  if (!selectedConversation) {
    return false;
  }

  return selectedConversation.participants.some((participant) => {
    return participant.userProfile === null;
  });
};

export const selectShouldGiveFeedback = (state: RootState): boolean => {
  const selectedConversation = selectSelectedConversation(state);
  if (!selectedConversation) {
    return false;
  }
  return selectedConversation.shouldGiveFeedback || false;
};

const selectCurrentUserIdParam = (
  _state: RootState,
  currentUserId: string | null
): string | null => currentUserId;

const selectCurrentUserHasSentMessagesSelector = createSelector(
  [selectSelectedConversation, selectCurrentUserIdParam],
  (selectedConversation, currentUserId): boolean => {
    if (!selectedConversation || !currentUserId) {
      return false;
    }

    return selectedConversation.messages.some(
      (message) => message.authorId === currentUserId
    );
  }
);

export const selectCurrentUserHasSentMessages =
  (currentUserId: string | null) =>
  (state: RootState): boolean =>
    selectCurrentUserHasSentMessagesSelector(state, currentUserId);
