import { RootState } from './messaging.slice';

export const selectConversations = (state: RootState) =>
  state.messaging.conversations;

export const selectSelectedConversation = (state: RootState) =>
  state.messaging.selectedConversation;

export const selectSelectedConversationId = (state: RootState) =>
  state.messaging.selectedConversationId;

export const selectPinnedInfo = (state: RootState) =>
  state.messaging.pinnedInfo;

export const selectQuery = (state: RootState) => state.messaging.query;

export const selectHasMessages = (state: RootState) =>
  state.messaging.conversations === null ||
  state.messaging.conversations.length > 0 ||
  state.messaging.query !== '' ||
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