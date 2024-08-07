import React from 'react';
import { MessagingConversationListItem } from '../MessagingConversationListItem/MessagingConversationListItem';
import { ContainerStyled } from './MessagingConversationList.styles';

export const MessagingConversationList = () => {
  const conversations = [
    {
      id: 1,
      name: 'Adriana mirabelle',
      role: 'Coach',
      message: 'Salut, comment vas-tu ?',
    },
    {
      id: 2,
      name: 'Adriana mirabelle',
      role: 'Coach',
      message: 'Salut, comment vas-tu ?',
    },
    {
      id: 3,
      name: 'Adriana mirabelle',
      role: 'Coach',
      message: 'Salut, comment vas-tu ?',
    },
  ];

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
