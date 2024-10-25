import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { Conversation, User } from 'src/api/types';
import { conversationHasUnreadMessages } from 'src/components/backoffice/messaging/messaging.utils';
import { ImgProfile, Typography } from 'src/components/utils';
import { useIsDesktop } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  StyledContainer,
  StyledConversationMainInfos,
  StyledConversationParticipants,
  StyledMessageDate,
  StyledMessagePreview,
} from './ConversationItem.styles';

export interface ConversationItemProps {
  conversation: Conversation;
}

export const ConversationItem = ({ conversation }: ConversationItemProps) => {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const currentUserId = useSelector(selectCurrentUserId);
  const addresee = conversation.participants.find(
    (participant) => participant.id !== currentUserId
  ) as User;
  const userHasSeenConversation = conversationHasUnreadMessages(
    conversation,
    currentUserId
  );

  const openConversation = () => {
    router.push(`/backoffice/messaging?userId=${addresee.id}`);
  };

  return (
    <StyledContainer onClick={openConversation}>
      <StyledConversationMainInfos>
        <StyledConversationParticipants>
          <ImgProfile user={addresee} size={25} />
          <Typography weight="bold">
            {`${addresee.firstName} ${addresee.lastName}`}
          </Typography>
        </StyledConversationParticipants>
        {isDesktop && (
          <StyledMessagePreview hasSeen={userHasSeenConversation}>
            <Typography>{conversation.messages[0].content}</Typography>
          </StyledMessagePreview>
        )}
        <StyledMessageDate>
          <Typography>
            {moment(conversation.messages[0].createdAt).format('DD/MM/YYYY')}
          </Typography>
        </StyledMessageDate>
      </StyledConversationMainInfos>
      {!isDesktop && (
        <StyledMessagePreview
          weight={userHasSeenConversation ? 'bold' : undefined}
        >
          <Typography size="small">
            {conversation.messages[0].content}
          </Typography>
        </StyledMessagePreview>
      )}
    </StyledContainer>
  );
};
