import moment from 'moment';
import { Conversation } from 'src/api/types';

export const conversationHasUnreadMessages = (
  conversation: Conversation,
  userId
) => {
  const userParticipantConversation = conversation.participants.find(
    (participant) => participant.id === userId
  );
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const seenAt = userParticipantConversation?.ConversationParticipant.seenAt;
  return seenAt && moment(seenAt).isSameOrAfter(lastMessage.createdAt);
};
