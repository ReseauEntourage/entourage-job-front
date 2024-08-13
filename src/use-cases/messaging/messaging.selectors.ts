import { RootState } from './messaging.slice';

export const selectConversations = (state: RootState) =>
  state.messaging.conversations;

export const selectSelectedConversation = (state: RootState) =>
  state.messaging.selectedConversation;

export const selectSelectedConversationId = (state: RootState) =>
  state.messaging.selectedConversationId;
