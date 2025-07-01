import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { Conversation, ConversationParticipant } from 'src/api/types';
import { conversationHasUnreadMessages } from 'src/components/backoffice/messaging/messaging.utils';
import { ImgProfile, Text } from 'src/components/utils';
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
  ) as ConversationParticipant;
  const userHasSeenConversation = !conversationHasUnreadMessages(
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
          <ImgProfile
            user={addresee}
            size={25}
            hasPicture={addresee.userProfile?.hasPicture || false}
          />
          <Text weight="bold">
            {`${addresee.firstName} ${addresee.lastName}`}
          </Text>
        </StyledConversationParticipants>
        {isDesktop && (
          <StyledMessagePreview hasSeen={userHasSeenConversation}>
            <Text weight={!userHasSeenConversation ? 'bold' : undefined}>
              {conversation.messages[0].content}
            </Text>
          </StyledMessagePreview>
        )}
        <StyledMessageDate>
          <Text>
            {moment(conversation.messages[0].createdAt).format('DD/MM/YYYY')}
          </Text>
        </StyledMessageDate>
      </StyledConversationMainInfos>
      {!isDesktop && (
        <StyledMessagePreview>
          <Text
            size="small"
            weight={!userHasSeenConversation ? 'bold' : undefined}
          >
            {conversation.messages[0].content}
          </Text>
        </StyledMessagePreview>
      )}
    </StyledContainer>
  );
};
