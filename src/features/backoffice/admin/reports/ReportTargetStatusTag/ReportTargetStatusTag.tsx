import React from 'react';
import { ReportTargetStatus } from '@/src/api/types';
import { REPORT_TARGET_STATUS_LABELS } from '../reports.labels';
import { StyledReportTargetStatus } from './ReportTargetStatusTag.styles';

export function ReportTargetStatusTag({
  status,
}: {
  status: ReportTargetStatus;
}) {
  return (
    <StyledReportTargetStatus $isPending={status === 'PENDING'}>
      {REPORT_TARGET_STATUS_LABELS[status]}
    </StyledReportTargetStatus>
  );
}
