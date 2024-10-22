/* eslint-disable react/no-danger */
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { Message } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { escapeHtml, linkify } from 'src/utils';
import { MessageContainer, StyledMessage } from './MessagingMessage.styles';
import { MessagingMessageSuspiciousModal } from './MessagingMessageSuspiciousModal/MessagingMessageSuspiciousModal';

export interface MessagingMessageProps {
  message: Message;
}

export const MessagingMessage = ({ message }: MessagingMessageProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const isOwnMessage = message.author.id === currentUserId;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const whitelist = process.env.LINKIFY_SAFE_DOMAINS?.split(',') || [];
    const target = event.target as HTMLAnchorElement;

    if (target.tagName === 'A') {
      const domainMatch = target.href.match(/https?:\/\/(www\.)?([\w.-]+)/i);
      const domain = domainMatch ? domainMatch[2] : '';
      const isVerifiedDomain = whitelist.some((whitelistedDomain) =>
        domain.endsWith(whitelistedDomain)
      );

      if (!isVerifiedDomain) {
        event.preventDefault();
        openModal(<MessagingMessageSuspiciousModal href={target.href} />);
      }
    }
  };

  return (
    <MessageContainer className={isOwnMessage ? 'own-message' : ''}>
      <StyledMessage className={isOwnMessage ? 'own-message' : ''}>
        <p
          dangerouslySetInnerHTML={{
            __html: linkify(escapeHtml(message.content)),
          }}
          onClick={handleClick}
        />
      </StyledMessage>
      <p className="message-date">{moment(message.createdAt).format('LLL')}</p>
    </MessageContainer>
  );
};
