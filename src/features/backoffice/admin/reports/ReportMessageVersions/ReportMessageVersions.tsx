import React, { useEffect } from 'react';
import { Text } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { REVISIONS_MODAL } from '@/src/features/backoffice/help-groups/help-groups-participation.labels';
import { formatHelpGroupDateTime } from '@/src/features/backoffice/help-groups/help-groups.labels';
import { useLazyGetHelpGroupMessageRevisionsQuery } from '@/src/use-cases/help-groups';
import { ReportPanelTitle } from '../ReportPanelTitle';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import {
  StyledReportVersion,
  StyledReportVersionList,
  StyledReportVersions,
} from './ReportMessageVersions.styles';

interface ReportMessageVersionsProps {
  kind: 'discussions' | 'replies';
  id: string;
}

/**
 * Versions of a reported group message, from the same source as the
 * revisions modal of the thread: the current version first, then the
 * previous ones from the most recent. Readable whatever the message state.
 */
export function ReportMessageVersions({
  kind,
  id,
}: ReportMessageVersionsProps) {
  const [fetchRevisions, { data, isLoading, isError }] =
    useLazyGetHelpGroupMessageRevisionsQuery();

  useEffect(() => {
    fetchRevisions({ kind, id });
  }, [fetchRevisions, kind, id]);

  return (
    <StyledReportVersions data-testid="report-message-versions">
      <ReportPanelTitle>{REPORTS_TAB_LABELS.versionsTitle}</ReportPanelTitle>
      {isLoading && <Spinner />}
      {isError && <Text color="lightRed">{REVISIONS_MODAL.error}</Text>}
      {data && (
        <StyledReportVersionList>
          {[
            {
              key: 'current',
              isCurrent: true,
              label: `${REVISIONS_MODAL.current} · ${formatHelpGroupDateTime(
                data.current.date
              )}`,
              title: data.current.title,
              content: data.current.content,
            },
            ...data.previous.map((revision) => ({
              key: revision.id,
              isCurrent: false,
              label: formatHelpGroupDateTime(revision.createdAt),
              title: revision.title,
              content: revision.content,
            })),
          ].map(({ key, isCurrent, label, title, content }) => (
            <StyledReportVersion
              key={key}
              $isCurrent={isCurrent}
              data-testid="report-message-version"
            >
              <Text size="small" color="darkGray">
                {label}
              </Text>
              {title && <Text weight="semibold">{title}</Text>}
              <Text color={isCurrent ? 'black' : 'darkGray'}>{content}</Text>
            </StyledReportVersion>
          ))}
        </StyledReportVersionList>
      )}
    </StyledReportVersions>
  );
}
