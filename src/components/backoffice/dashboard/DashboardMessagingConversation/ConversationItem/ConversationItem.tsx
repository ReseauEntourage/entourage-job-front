import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { Conversation, User } from 'src/api/types';
import { ImgProfile } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledContainer,
  StyledConversationParticipants,
  StyledMessageDate,
  StyledMessagePreview,
} from './ConversationItem.styles';

export interface ConversationItemProps {
  conversation: Conversation;
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
  const router = useRouter();
  const currentUserId = useSelector(selectCurrentUserId);
  const addresee = conversation.participants.find(
    (participant) => participant.id !== currentUserId
  ) as User;
  const userParticipantConversation = conversation.participants.find(
    (participant) => participant.id === currentUserId
  );
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const seenAt = userParticipantConversation?.ConversationParticipant.seenAt;
  const userHasSeenConversation =
    seenAt && moment(seenAt).isSameOrAfter(lastMessage.createdAt);

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${addresee.id}`);
  };

  return (
    <StyledContainer onClick={openConversation}>
      <StyledConversationParticipants>
        <ImgProfile user={addresee} size={25} />
        {`${addresee.firstName} ${addresee.lastName}`}
      </StyledConversationParticipants>
      <StyledMessagePreview hasSeen={userHasSeenConversation}>
        {conversation.messages[0].content}
      </StyledMessagePreview>
      <StyledMessageDate>
        {moment(conversation.messages[0].createdAt).format('DD/MM/YYYY')}
      </StyledMessageDate>
    </StyledContainer>
  );
};
