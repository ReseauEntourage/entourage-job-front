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
  const otherParticipants = conversation.participants.filter(
    (participant) => participant.id !== userId
  );
  const allOtherParticipantsDeleted =
    otherParticipants.length > 0 &&
    otherParticipants.every((participant) => participant.userProfile === null);
  if (allOtherParticipantsDeleted) {
    return false;
  }
  const { seenAt } = conversation;
  const hasUnreadMessages =
    !seenAt || moment(lastMessage.createdAt).isSameOrAfter(seenAt);
  return hasUnreadMessages;
};
