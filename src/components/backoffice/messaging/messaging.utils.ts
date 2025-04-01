import moment from 'moment';
import { Conversation } from 'src/api/types';

export const conversationHasUnreadMessages = (
  conversation: Conversation
): boolean => {
  const lastMessage = conversation.messages[0];
  const { seenAt } = conversation;
  const userHasSeenConversation =
    seenAt && moment(seenAt).isSameOrAfter(lastMessage.createdAt);
  return !!userHasSeenConversation;
};
