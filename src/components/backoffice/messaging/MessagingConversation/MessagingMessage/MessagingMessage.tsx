import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Message } from 'src/api/types';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { MessageContainer, StyledMessage } from './MessagingMessage.styles';

export interface MessagingMessageProps {
  message: Message;
}

export const MessagingMessage = ({ message }: MessagingMessageProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnMessage = message.author.id === currentUserId;
  return (
    <MessageContainer className={isOwnMessage ? 'own-message' : ''}>
      <StyledMessage className={isOwnMessage ? 'own-message' : ''}>
        <p>{message.content}</p>
      </StyledMessage>
      <p className="message-date">{moment(message.createdAt).format('LLL')}</p>
    </MessageContainer>
  );
};
