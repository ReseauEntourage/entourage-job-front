import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessagingConversationListItem } from '../MessagingConversationListItem/MessagingConversationListItem';
import {
  messagingActions,
  selectConversations,
  selectQuery,
} from 'src/use-cases/messaging';
import { ContainerStyled } from './MessagingConversationList.styles';

export const MessagingConversationList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectConversations);
  const query = useSelector(selectQuery);

  useEffect(() => {
    dispatch(messagingActions.getConversationsRequested());
  }, [dispatch, query]);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(messagingActions.setQuery(event.target.value));
  };

  return (
    <ContainerStyled>
      <input type="text" onChange={onSearchChange} />
      {conversations.map((conversation) => (
        <MessagingConversationListItem
          key={conversation.id}
          conversation={conversation}
        />
      ))}
    </ContainerStyled>
  );
};
