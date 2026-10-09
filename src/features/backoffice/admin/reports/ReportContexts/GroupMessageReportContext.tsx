import React from 'react';
import { ReportTargetContext } from '@/src/api/types';
import { LucidIcon, Text } from '@/src/components/ui';
import { HelpGroupAvatar } from '@/src/features/backoffice/help-groups/HelpGroupAvatar';
import { EDITED_MENTION } from '@/src/features/backoffice/help-groups/help-groups-participation.labels';
import { formatHelpGroupDateTime } from '@/src/features/backoffice/help-groups/help-groups.labels';
import { ReportLink } from '../ReportLink';
import { ReportPanelTitle } from '../ReportPanelTitle';
import { ReportPerson } from '../ReportPerson';
import {
  formatReportZone,
  GROUP_MESSAGE_STATE_BANNERS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { getGroupMessageHref } from '../reports.utils';
import {
  StyledReportContext,
  StyledReportContextBody,
  StyledReportGroupMessage,
  StyledReportGroupMessageBody,
  StyledReportLinks,
  StyledReportMessageAuthor,
  StyledReportMessageMeta,
  StyledReportReference,
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
  const isDeleted = message?.state === 'DELETED';
  const groupName = group?.name ?? REPORTS_TAB_LABELS.deletedGroup;
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
      <StyledReportContextBody>
        <ReportPanelTitle>
          {REPORTS_TAB_LABELS.reportedMessage}
        </ReportPanelTitle>
        <StyledReportReference>
          {REPORTS_TAB_LABELS.group}{' '}
          {group ? (
            <ReportLink
              $isBold={false}
              href={`/backoffice/groupes/${encodeURIComponent(group.slug)}`}
            >
              {groupName}
            </ReportLink>
          ) : (
            groupName
          )}
          {message && (
            <>
              {' '}
              · {REPORTS_TAB_LABELS.discussion}{' '}
              {group && !isDeleted ? (
                <ReportLink
                  $isBold={false}
                  href={getGroupMessageHref({
                    slug: group.slug,
                    discussionId: message.discussionId,
                    replyId: null,
                  })}
                >
                  « {message.discussionTitle} »
                </ReportLink>
              ) : (
                `« ${message.discussionTitle} »`
              )}
            </>
          )}
        </StyledReportReference>
        {message ? (
          <>
            <StyledReportGroupMessage>
              <HelpGroupAvatar user={author ?? null} size={36} />
              <StyledReportGroupMessageBody>
                <StyledReportMessageMeta>
                  <StyledReportMessageAuthor>
                    {author
                      ? `${author.firstName} ${author.lastName}`
                      : REPORTS_TAB_LABELS.deletedUser}
                  </StyledReportMessageAuthor>
                  {[
                    author?.role,
                    author?.zone ? formatReportZone(author.zone) : null,
                    formatHelpGroupDateTime(message.createdAt),
                  ]
                    .filter(Boolean)
                    .map((part) => ` · ${part}`)
                    .join('')}
                  {message.isEdited && (
                    <>
                      {' · '}
                      <em>{EDITED_MENTION}</em>
                    </>
                  )}
                </StyledReportMessageMeta>
                {message.title && (
                  <Text weight="semibold">{message.title}</Text>
                )}
                <Text>{message.content}</Text>
              </StyledReportGroupMessageBody>
            </StyledReportGroupMessage>
            <StyledReportLinks>
              {group && !isDeleted && (
                <ReportLink
                  href={getGroupMessageHref({
                    slug: group.slug,
                    discussionId: message.discussionId,
                    replyId: message.replyId,
                  })}
                  data-testid="report-group-message-link"
                >
                  {REPORTS_TAB_LABELS.seeMessage}
                </ReportLink>
              )}
              {author && (
                <ReportPerson
                  user={author}
                  linksOnly
                  profileLabel={REPORTS_TAB_LABELS.formatSeeProfileOf(
                    author.firstName
                  )}
                />
              )}
            </StyledReportLinks>
          </>
        ) : (
          <Text variant="italic">{REPORTS_TAB_LABELS.missingMessage}</Text>
        )}
      </StyledReportContextBody>
    </StyledReportContext>
  );
}
