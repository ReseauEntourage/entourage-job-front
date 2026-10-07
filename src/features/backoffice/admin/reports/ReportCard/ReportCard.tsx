import React from 'react';
import { ReportItem } from '@/src/api/types';
import { Tag, TagSize, Text } from '@/src/components/ui';
import { ReportPerson } from '../ReportPerson';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  formatReportDate,
  formatReportReason,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import {
  StyledReportCard,
  StyledReportCardHeader,
  StyledReportCardReason,
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

export function ReportCard({ report }: { report: ReportItem }) {
  const resolution = formatResolution(report);
  return (
    <StyledReportCard data-testid={`report-${report.id}`}>
      <StyledReportCardHeader>
        <ReportPerson user={report.reporter} />
        <ReportTargetStatusTag status={report.status} />
      </StyledReportCardHeader>
      <StyledReportCardReason>
        <Tag size={TagSize.Small}>{formatReportReason(report.reason)}</Tag>
        <Text size="small" color="darkGray">
          {formatReportDate(report.createdAt)}
        </Text>
      </StyledReportCardReason>
      <Text
        variant={report.comment ? 'normal' : 'italic'}
        color={report.comment ? 'black' : 'darkGray'}
      >
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
