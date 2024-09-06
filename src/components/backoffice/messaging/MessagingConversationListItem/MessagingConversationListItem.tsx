import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Conversation, User } from 'src/api/types';
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
  ) as User;
  const lastMessage = conversation.messages[0];
  const userParticipantConversation = conversation.participants.find(
    (participant) => participant.id === currentUserId
  );
  const seenAt = userParticipantConversation?.ConversationParticipant.seenAt;
  const userHasSeenConversation =
    seenAt && moment(seenAt).isAfter(lastMessage.createdAt);

  useEffect(() => {
    setIsActivated(selectedConversationId === conversation.id);
  }, [selectedConversationId, conversation.id]);

  const selectConversation = () => {
    dispatch(messagingActions.selectConversation(conversation.id));
  };

  return (
    <ContainerStyled onClick={selectConversation} isActive={isActivated}>
      <ContainerAvatarStyled>
        <ImgProfile user={addresee} size={35} />
      </ContainerAvatarStyled>
      <RightColumn seen={userHasSeenConversation}>
        <MainInfos>
          <ConversationAddresee>
            <p className="addresee-name">
              {addresee.firstName} {addresee.lastName}
            </p>
            <p>{addresee.role}</p>
          </ConversationAddresee>
          <p>{moment(lastMessage.createdAt).format('DD/MM/YYYY')}</p>
        </MainInfos>
        <p className="preview-last-message">{lastMessage.content}</p>
      </RightColumn>
    </ContainerStyled>
  );
};
