import React from 'react';
import { ReportItem } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { ReportPerson } from '../ReportPerson';
import { ReportTargetStatusTag } from '../ReportTargetRow';
import {
  formatReportDate,
  formatReportReason,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import {
  StyledReportCard,
  StyledReportCardHeader,
} from './ReportTargetPage.styles';

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

export function ReportCard({ report }: { report: ReportItem }) {
  const resolution = formatResolution(report);
  return (
    <StyledReportCard data-testid={`report-${report.id}`}>
      <StyledReportCardHeader>
        <ReportPerson user={report.reporter} />
        <ReportTargetStatusTag status={report.status} />
      </StyledReportCardHeader>
      <Text size="small" color="darkGray">
        {formatReportDate(report.createdAt)}
      </Text>
      <Text>
        <strong>Motif :</strong> {formatReportReason(report.reason)}
      </Text>
      <Text variant={report.comment ? 'normal' : 'italic'}>
        {report.comment || REPORTS_TAB_LABELS.noComment}
      </Text>
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
