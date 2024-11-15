import {
  Conversation,
  ConversationParticipants,
  MessageWithConversation,
} from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const getConversationsAdapter = createRequestAdapter(
  'getConversations'
).withPayloads<void, Conversation[]>();

export const getUnseenConversationsCountAdapter = createRequestAdapter(
  'getUnseenConversationsCount'
).withPayloads<void, number>();

export const postMessageAdapter = createRequestAdapter(
  'postMessage'
).withPayloads<
  {
    content: string;
    conversationId?: string;
    participantIds?: string[];
  },
  {
    message: MessageWithConversation;
    isNewConversation: boolean;
  }
>();

export const getSelectedConversationAdapter = createRequestAdapter(
  'getSelectedConversation'
).withPayloads<void, Conversation>();

export const bindNewConversationAdapter = createRequestAdapter(
  'bindNewConversation'
).withPayloads<string, ConversationParticipants>();
