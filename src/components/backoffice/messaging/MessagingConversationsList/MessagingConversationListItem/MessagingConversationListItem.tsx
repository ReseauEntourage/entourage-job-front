import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { conversationHasUnreadMessages } from '../../messaging.utils';
import { Conversation, ConversationParticipant } from 'src/api/types';
import { ImgProfile } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import {
  ContainerAvatarStyled,
  ConversationAddresee,
  MainInfos,
  ContainerStyled,
  RightColumn,
} from './MessagingConversationListItem.styles';

interface MessagingConversationListItemProps {
  conversation: Conversation;
}

export const MessagingConversationListItem = ({
  conversation,
}: MessagingConversationListItemProps) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const [isActivated, setIsActivated] = React.useState(false);

  const addresee = conversation.participants.find(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipant;

  const lastMessage = conversation.messages[0];

  const hasUnreadMessages = conversationHasUnreadMessages(
    conversation,
    currentUserId
  );
  const shouldHighlightConversation =
    hasUnreadMessages || conversation.shouldGiveFeedback;

  useEffect(() => {
    setIsActivated(selectedConversationId === conversation.id);
  }, [selectedConversationId, conversation.id]);

  const selectConversation = () => {
    dispatch(messagingActions.selectConversation(conversation.id));
  };

  return (
    <ContainerStyled onClick={selectConversation} isActive={isActivated}>
      <ContainerAvatarStyled>
        {addresee && (
          <ImgProfile
            user={addresee}
            size={35}
            hasPicture={addresee.userProfile?.hasPicture || false}
          />
        )}
      </ContainerAvatarStyled>
      <RightColumn highlight={shouldHighlightConversation}>
        <MainInfos>
          {addresee && (
            <ConversationAddresee>
              <p className="addresee-name">
                {addresee.firstName} {addresee.lastName}
              </p>
              <p>{addresee.role}</p>
            </ConversationAddresee>
          )}
          <p>{moment(lastMessage.createdAt).format('DD/MM/YYYY')}</p>
        </MainInfos>
        {lastMessage.content && (
          <p className="preview-last-message">{lastMessage.content}</p>
        )}
        {!lastMessage.content && lastMessage.medias && (
          <p className="preview-last-message">
            {lastMessage.author.firstName} a envoyé {lastMessage.medias.length}{' '}
            fichier
            {lastMessage.medias.length > 1 ? 's' : ''}
          </p>
        )}
      </RightColumn>
    </ContainerStyled>
  );
};
