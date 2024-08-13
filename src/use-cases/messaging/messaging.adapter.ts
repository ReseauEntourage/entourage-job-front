import { Conversation, Message } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const getConversationsAdapter = createRequestAdapter(
  'getConversations'
).withPayloads<void, Conversation[]>();

export const postMessageAdapter = createRequestAdapter(
  'postMessage'
).withPayloads<
  {
    content: string;
    conversationId: string;
  },
  Message
>();

export const getConversationByIdAdapter = createRequestAdapter(
  'getConversationById'
).withPayloads<string, Conversation>();
