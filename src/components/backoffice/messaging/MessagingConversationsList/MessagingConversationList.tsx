import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingConversationListItem } from '../MessagingConversationListItem/MessagingConversationListItem';
import { messagingActions, selectConversations } from 'src/use-cases/messaging';
import { ContainerStyled } from './MessagingConversationList.styles';

export const MessagingConversationList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch]);

  return (
    <ContainerStyled>
      {conversations.map((conversation) => (
        <MessagingConversationListItem
          key={conversation.id}
          conversation={conversation}
        />
      ))}
    </ContainerStyled>
  );
};
