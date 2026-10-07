import React from 'react';
import { ReportTargetContext } from '@/src/api/types';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { HelpGroupAvatar } from '@/src/features/backoffice/help-groups/HelpGroupAvatar';
import { formatHelpGroupDateTime } from '@/src/features/backoffice/help-groups/help-groups.labels';
import { ReportPerson } from '../ReportPerson';
import {
  formatReportZone,
  GROUP_MESSAGE_STATE_BANNERS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { getGroupMessageHref } from '../reports.utils';
import {
  StyledReportContext,
  StyledReportGroupMessage,
  StyledReportGroupMessageBody,
  StyledReportLinks,
  StyledReportState,
} from './ReportContexts.styles';

type GroupMessageContext = Extract<
  ReportTargetContext,
  { targetType: 'POST' | 'POST_REPLY' }
>;

const STATE_ICONS = {
  HIDDEN: 'EyeOff',
  VISIBLE: 'Eye',
  DELETED: 'Trash2',
} as const;

/**
 * The reported message (even hidden or deleted) with its state, its group,
 * its author and a link to it in its thread.
 */
export function GroupMessageReportContext({
  context,
}: {
  context: GroupMessageContext;
}) {
  const { group, message } = context;
  const author = message?.author;
  return (
    <StyledReportContext data-testid="report-context-group-message">
      {message && (
        <StyledReportState
          $state={message.state}
          data-testid="report-group-message-state"
        >
          <LucidIcon name={STATE_ICONS[message.state]} size={16} />
          {GROUP_MESSAGE_STATE_BANNERS[message.state]}
        </StyledReportState>
      )}
      <H5 title={REPORTS_TAB_LABELS.reportedMessage} />
      <Text size="small" color="darkGray">
        {`${REPORTS_TAB_LABELS.group} : ${
          group?.name ?? REPORTS_TAB_LABELS.deletedGroup
        }`}
      </Text>
      {message ? (
        <>
          <StyledReportGroupMessage>
            <HelpGroupAvatar
              userId={author?.id ?? null}
              initials={
                author
                  ? `${author.firstName.charAt(0)}${author.lastName.charAt(0)}`
                  : null
              }
              size={36}
            />
            <StyledReportGroupMessageBody>
              <Text size="small" color="darkGray">
                {[
                  author
                    ? `${author.firstName} ${author.lastName}`
                    : REPORTS_TAB_LABELS.deletedUser,
                  author?.role,
                  author?.zone ? formatReportZone(author.zone) : null,
                  formatHelpGroupDateTime(message.createdAt),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
              {message.title && <Text weight="semibold">{message.title}</Text>}
              <Text>{message.content}</Text>
            </StyledReportGroupMessageBody>
          </StyledReportGroupMessage>
          <StyledReportLinks>
            {group && message.state !== 'DELETED' && (
              <Button
                variant="text"
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
            {author && <ReportPerson user={author} linksOnly />}
          </StyledReportLinks>
        </>
      ) : (
        <Text variant="italic">{REPORTS_TAB_LABELS.missingMessage}</Text>
      )}
    </StyledReportContext>
  );
}
