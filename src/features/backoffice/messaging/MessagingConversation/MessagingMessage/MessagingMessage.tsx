import moment from 'moment';
import 'moment/locale/fr';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Message, MessageType, ServiceMessageKind } from '@/src/api/types';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { Text } from '@/src/components/ui/Text';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { selectCurrentUserId } from '@/src/use-cases/current-user';
import { selectSelectedConversationId } from '@/src/use-cases/messaging';
import { escapeHtml, linkify } from '@/src/utils';
import { isSuspiciousMessage } from '@/src/utils/SuspiciousContent';
import { MessagingConversationReportModal } from '../MessagingConversationReport/MessagingConversationReportModal';
import { MessageMedias } from './MessageMedias/MessageMedias';
import {
  MessageContainer,
  StyledMessage,
  StyledServiceMessage,
  StyledServiceMessageQuote,
  StyledWarning,
} from './MessagingMessage.styles';
import { MessagingMessageSuspiciousModal } from './MessagingMessageSuspiciousModal/MessagingMessageSuspiciousModal';

interface MessagingMessageProps {
  message: Message;
}

export const MessagingMessage = ({ message }: MessagingMessageProps) => {
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const currentUserId = useSelector(selectCurrentUserId);
  const isServiceMessage = message.type === MessageType.SERVICE;
  const isOwnMessage =
    !isServiceMessage && message.author?.id === currentUserId;
  const [isSuspicious, setIsSuspicious] = React.useState(false);

  useEffect(() => {
    if (message.content) {
      setIsSuspicious(isSuspiciousMessage(message.content));
    }
  }, [message.content]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const whitelist =
      process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS?.split(',') || [];
    const target = event.target as HTMLAnchorElement;

    if (target.tagName === 'A') {
      const domainMatch = target.href.match(/https?:\/\/(www\.)?([\w.-]+)/i);
      const domain = domainMatch ? domainMatch[2] : '';
      const isVerifiedDomain = whitelist.some((whitelistedDomain) =>
        domain.endsWith(whitelistedDomain)
      );
      const isSentByAdmin = message.author?.role === UserRoles.ADMIN;

      if (!isVerifiedDomain && !isSentByAdmin) {
        event.preventDefault();
        openModal(<MessagingMessageSuspiciousModal href={target.href} />);
      }
    }
  };

  const reportMessage = () => {
    const reportContent = `Le message suivant me semble suspicieux : "${message.content}"`;
    if (selectedConversationId) {
      openModal(
        <MessagingConversationReportModal
          conversationId={selectedConversationId}
          content={reportContent}
        />
      );
    }
  };

  if (isServiceMessage) {
    const checkinNote =
      message.serviceMessageKind === ServiceMessageKind.CHECKIN_NOTE
        ? message.metadata
        : null;

    return (
      <MessageContainer
        className="service-message"
        data-testid="messaging-message"
        data-message-type="SERVICE"
      >
        <StyledServiceMessage>
          {checkinNote ? (
            <>
              <Text size="small" center>
                💬 {checkinNote.authorFirstName} a fait son bilan et vous a
                laissé un mot :
              </Text>
              <StyledServiceMessageQuote>
                <Text size="small" center>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: linkify(escapeHtml(checkinNote.quotedText)),
                    }}
                  />
                </Text>
              </StyledServiceMessageQuote>
            </>
          ) : (
            <Text size="small" center>
              <span
                dangerouslySetInnerHTML={{
                  __html: linkify(escapeHtml(message.content)),
                }}
              />
            </Text>
          )}
        </StyledServiceMessage>
        <p className="message-date">
          {moment(message.createdAt).format('LLL')}
        </p>
      </MessageContainer>
    );
  }

  return (
    <MessageContainer
      className={isOwnMessage ? 'own-message' : ''}
      data-testid="messaging-message"
      data-own-message={isOwnMessage}
    >
      <StyledMessage className={isOwnMessage ? 'own-message' : ''}>
        {message.medias.length > 0 && <MessageMedias medias={message.medias} />}
        <Text>
          <span
            dangerouslySetInnerHTML={{
              __html: linkify(escapeHtml(message.content)),
            }}
            onClick={handleClick}
          />
        </Text>
      </StyledMessage>
      {!isOwnMessage && isSuspicious && (
        <StyledWarning>
          <LucidIcon name="TriangleAlert" color={COLORS.lightRed} />
          <Text size="small" color="lightRed">
            Attention, ce message est peut-être malveillant. Nous vous
            recommandons de ne pas communiquer vos coordonnées et de nous&nbsp;
            <a onClick={reportMessage}>signaler ce message</a> en cas de doute
          </Text>
        </StyledWarning>
      )}
      <p className="message-date">{moment(message.createdAt).format('LLL')}</p>
    </MessageContainer>
  );
};
