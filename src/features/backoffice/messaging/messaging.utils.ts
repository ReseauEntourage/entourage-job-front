import moment from 'moment';
import { Conversation } from 'src/api/types';

export const conversationHasUnreadMessages = (
  conversation: Conversation,
  userId: string
): boolean => {
  const lastMessage = conversation.messages.find(
    (message) => message.authorId !== userId
  );
  if (!lastMessage) {
    return false;
  }
  const { seenAt } = conversation;
  const hasUnreadMessages =
    !seenAt || moment(lastMessage.createdAt).isSameOrAfter(seenAt);
  return hasUnreadMessages;
};
