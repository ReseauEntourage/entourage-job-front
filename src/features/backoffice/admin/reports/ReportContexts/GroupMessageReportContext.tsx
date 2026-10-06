import React from 'react';
import { ReportTargetContext } from '@/src/api/types';
import { Button, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { ReportPerson } from '../ReportPerson';
import {
  GROUP_MESSAGE_STATE_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { getGroupMessageHref } from '../reports.utils';
import {
  StyledReportContext,
  StyledReportContextBlock,
  StyledReportQuote,
  StyledReportState,
} from './ReportContexts.styles';

type GroupMessageContext = Extract<
  ReportTargetContext,
  { targetType: 'POST' | 'POST_REPLY' }
>;

/**
 * The group, the message (even hidden or deleted), its state and a link to
 * it in its thread, where it is restored or deleted.
 */
export function GroupMessageReportContext({
  context,
}: {
  context: GroupMessageContext;
}) {
  const { group, message } = context;
  return (
    <StyledReportContext data-testid="report-context-group-message">
      <StyledReportContextBlock>
        <H5 title={REPORTS_TAB_LABELS.group} />
        <Text weight="semibold">
          {group?.name ?? REPORTS_TAB_LABELS.deletedGroup}
        </Text>
      </StyledReportContextBlock>
      {message ? (
        <>
          <StyledReportContextBlock>
            <H5 title={REPORTS_TAB_LABELS.author} />
            <ReportPerson user={message.author} />
          </StyledReportContextBlock>
          <StyledReportContextBlock>
            <StyledReportState data-testid="report-group-message-state">
              <Text weight="semibold">
                {`État : ${GROUP_MESSAGE_STATE_LABELS[message.state]}`}
              </Text>
            </StyledReportState>
            <StyledReportQuote>
              {message.title && <Text weight="semibold">{message.title}</Text>}
              <Text>{message.content}</Text>
            </StyledReportQuote>
            {group && message.state !== 'DELETED' && (
              <Button
                variant="secondary"
                size="small"
                href={getGroupMessageHref({
                  slug: group.slug,
                  discussionId: message.discussionId,
                  replyId: message.replyId,
                })}
                dataTestId="report-group-message-link"
              >
                {REPORTS_TAB_LABELS.seeMessage}
              </Button>
            )}
            <Text size="small" variant="italic">
              {REPORTS_TAB_LABELS.groupMessageHandling}
            </Text>
          </StyledReportContextBlock>
        </>
      ) : (
        <Text variant="italic">{REPORTS_TAB_LABELS.missingMessage}</Text>
      )}
    </StyledReportContext>
  );
}
