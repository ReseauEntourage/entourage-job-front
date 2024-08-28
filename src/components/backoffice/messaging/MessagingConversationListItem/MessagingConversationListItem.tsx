import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Conversation } from 'src/api/types';
import {
  messagingActions,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { ContainerStyled } from './MessagingConversationListItem.styles';

interface MessagingConversationListItemProps {
  conversation: Conversation;
}

export const MessagingConversationListItem = ({
  conversation,
}: MessagingConversationListItemProps) => {
  const dispatch = useDispatch();
  const selectedConversationId = useSelector(selectSelectedConversationId);

  const selectConversation = () => {
    dispatch(messagingActions.selectConversation(conversation.id));
  };

  return (
    <ContainerStyled onClick={selectConversation}>
      Selected {selectedConversationId === conversation.id ? 'true' : 'false'}
      <p className="addressee-name">
        {conversation.participants
          .map(
            (participant) => `${participant.firstName} ${participant.lastName}`
          )
          .join(', ')}
      </p>
      <p className="addressee-role">Role</p>
      <p className="last-message-preview">
        {conversation.messages[0].content?.slice(0, 20)}
      </p>
    </ContainerStyled>
  );
};
