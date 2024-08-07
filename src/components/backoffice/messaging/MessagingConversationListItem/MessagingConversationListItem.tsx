import React from 'react';
import { ContainerStyled } from './MessagingConversationListItem.styles';

interface MessagingConversationListItemProps {
  conversation: {
    id: number;
    name: string;
    role: string;
    message: string;
  };
}

export const MessagingConversationListItem = ({
  conversation,
}: MessagingConversationListItemProps) => {
  return (
    <ContainerStyled>
      <p className="addressee-name">{conversation.name}</p>
      <p className="addressee-role">{conversation.role}</p>
      <p className="last-message-preview">
        {conversation.message.slice(0, 20)}
      </p>
    </ContainerStyled>
  );
};
