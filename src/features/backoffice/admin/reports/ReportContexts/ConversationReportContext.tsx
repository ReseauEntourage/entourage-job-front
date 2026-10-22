import moment from 'moment';
import 'moment/locale/fr';
import React, { useMemo } from 'react';
import { Message, MessageType, ReportUser } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { LinkifiedText } from '@/src/features/backoffice/messaging/MessagingConversation/MessagingMessage/LinkifiedText/LinkifiedText';
import { MessageMedias } from '@/src/features/backoffice/messaging/MessagingConversation/MessagingMessage/MessageMedias/MessageMedias';
import { useGetAdminReportedConversationMessagesInfiniteQuery } from '@/src/use-cases/reports';
import { ReportPerson } from '../ReportPerson';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import {
  StyledReportContext,
  StyledReportContextBlock,
  StyledReportMessage,
  StyledReportMessageHeader,
  StyledReportMessages,
} from './ReportContexts.styles';

interface ConversationReportContextProps {
  conversationId: string;
  participants: ReportUser[];
}

const authorName = (message: Message) =>
  message.type === MessageType.SERVICE
    ? 'Entourage Pro'
    : message.author
      ? `${message.author.firstName} ${message.author.lastName}`
      : REPORTS_TAB_LABELS.deletedUser;

/**
 * Participants and the whole conversation, read only: no editor, and the
 * admin is never added as a participant. Older messages are loaded by pages.
 */
export function ConversationReportContext({
  conversationId,
  participants,
}: ConversationReportContextProps) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetAdminReportedConversationMessagesInfiniteQuery(conversationId);

  // Pages hold the most recent messages first: shown oldest first
  const messages = useMemo(
    () => (data?.pages.flatMap((page) => page.messages) ?? []).reverse(),
    [data]
  );

  return (
    <StyledReportContext data-testid="report-context-conversation">
      <StyledReportContextBlock>
        <H5 title={REPORTS_TAB_LABELS.participants} />
        {participants.map((participant, index) => (
          <ReportPerson
            key={participant?.id ?? `deleted-${index}`}
            user={participant}
          />
        ))}
      </StyledReportContextBlock>
      <StyledReportContextBlock>
        <H5 title={REPORTS_TAB_LABELS.conversation} />
        {isError && <Text>{REPORTS_TAB_LABELS.messagesError}</Text>}
        {!isLoading && !isError && messages.length === 0 && (
          <Text variant="italic">{REPORTS_TAB_LABELS.noMessage}</Text>
        )}
        {messages.length > 0 && (
          <StyledReportMessages data-testid="report-conversation-messages">
            {hasNextPage && (
              <Button
                variant="text"
                size="small"
                disabled={isFetchingNextPage}
                onClick={() => {
                  fetchNextPage();
                }}
                dataTestId="report-conversation-older"
              >
                {REPORTS_TAB_LABELS.loadOlderMessages}
              </Button>
            )}
            {messages.map((message) => (
              <StyledReportMessage
                key={message.id}
                data-testid="report-conversation-message"
              >
                <StyledReportMessageHeader>
                  <Text weight="semibold" size="small">
                    {authorName(message)}
                  </Text>
                  <Text size="small" color="darkGray">
                    {moment(message.createdAt).format('LLL')}
                  </Text>
                </StyledReportMessageHeader>
                {message.medias?.length > 0 && (
                  <MessageMedias medias={message.medias} />
                )}
                <Text>
                  <LinkifiedText content={message.content} />
                </Text>
              </StyledReportMessage>
            ))}
          </StyledReportMessages>
        )}
      </StyledReportContextBlock>
    </StyledReportContext>
  );
}
