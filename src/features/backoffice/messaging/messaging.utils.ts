import moment from 'moment';
import {
  Conversation,
  Message,
  MessageType,
  ServiceMessageKind,
} from '@/src/api/types';

export const conversationHasUnreadMessages = (
  conversation: Conversation,
  userId: string
): boolean => {
  const lastMessage = conversation.messages.find(
    (message) =>
      message.authorId !== userId && message.type !== MessageType.SERVICE
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

// `messages` is ordered newest first. Used by conversation previews (dashboard widget,
// messaging list) so a SERVICE message never appears as the "last message" shown.
export const getLastUserMessage = (messages: Message[]): Message | undefined =>
  messages.find((message) => message.type !== MessageType.SERVICE);

// Used by messaging-checkin-banner to detect whether the other participant already sent
// their checkin note, without exposing any other checkin answer of theirs.
export const getCheckinNoteMessage = (
  messages: Message[]
): Message | undefined =>
  messages.find(
    (message) => message.serviceMessageKind === ServiceMessageKind.CHECKIN_NOTE
  );
