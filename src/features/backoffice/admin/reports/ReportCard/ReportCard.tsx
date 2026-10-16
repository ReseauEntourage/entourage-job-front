import React from 'react';
import { ReportItem } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { HelpGroupAvatar } from '@/src/features/backoffice/help-groups/HelpGroupAvatar';
import { ReportPerson } from '../ReportPerson';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  formatReportDate,
  formatReportReason,
  formatReportZone,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import {
  StyledReportCard,
  StyledReportCardHeader,
  StyledReportCardIdentity,
  StyledReportCardName,
  StyledReportReason,
} from './ReportCard.styles';

const formatResolution = (report: ReportItem) => {
  if (!report.resolvedAt) {
    return null;
  }
  if (report.resolution !== 'MANUAL') {
    return REPORTS_TAB_LABELS.resolvedAutomatically;
  }
  const adminName = report.resolvedBy
    ? `${report.resolvedBy.firstName} ${report.resolvedBy.lastName}`
    : REPORTS_TAB_LABELS.deletedUser;
  return REPORTS_TAB_LABELS.formatResolved(
    adminName,
    formatReportDate(report.resolvedAt)
  );
};

/**
 * A report of the page of a target: who reported (picture, name, role and
 * date), the reason, the comment and the shortcuts to the reporter.
 */
export function ReportCard({ report }: { report: ReportItem }) {
  const resolution = formatResolution(report);
  const { reporter } = report;
  return (
    <StyledReportCard data-testid={`report-${report.id}`}>
      <StyledReportCardHeader>
        <HelpGroupAvatar user={reporter} size={32} />
        <StyledReportCardIdentity>
          {reporter ? (
            <>
              <StyledReportCardName>
                {reporter.firstName} {reporter.lastName}
              </StyledReportCardName>
              <Text size="small" color="darkGray">
                {[
                  reporter.role,
                  reporter.zone ? formatReportZone(reporter.zone) : null,
                  formatReportDate(report.createdAt),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </>
          ) : (
            <>
              <Text variant="italic">{REPORTS_TAB_LABELS.deletedUser}</Text>
              <Text size="small" color="darkGray">
                {formatReportDate(report.createdAt)}
              </Text>
            </>
          )}
        </StyledReportCardIdentity>
        <ReportTargetStatusTag status={report.status} />
      </StyledReportCardHeader>
      <StyledReportReason>
        {formatReportReason(report.reason)}
      </StyledReportReason>
      <Text color={report.comment ? 'black' : 'darkGray'}>
        {report.comment || REPORTS_TAB_LABELS.noComment}
      </Text>
      {reporter && (
        <ReportPerson
          user={reporter}
          linksOnly
          profileLabel={REPORTS_TAB_LABELS.seeProfileOfReporter}
        />
      )}
      {resolution && (
        <Text size="small" weight="semibold">
          {resolution}
        </Text>
      )}
      {report.resolutionNote && (
        <Text size="small">{report.resolutionNote}</Text>
      )}
    </StyledReportCard>
  );
}
