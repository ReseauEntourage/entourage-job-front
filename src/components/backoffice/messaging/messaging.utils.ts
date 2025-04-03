/* eslint-disable no-console */
import moment from 'moment';
import { Conversation } from 'src/api/types';

export const conversationHasUnreadMessages = (
  conversation: Conversation
): boolean => {
  const lastMessage = conversation.messages[0];
  const { seenAt } = conversation;
  console.log('conversationId', conversation.id);
  console.log('lastMessage', lastMessage);
  console.log('seenAt', seenAt);
  const hasUnreadMessages =
    !seenAt || moment(lastMessage.createdAt).isSameOrAfter(seenAt);
  return hasUnreadMessages;
};
