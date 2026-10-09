import React from 'react';
import { ReportTargetStatus } from '@/src/api/types';
import { Badge, BadgeVariant } from '@/src/components/ui';
import {
  REPORT_TARGET_STATUS_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';

interface ReportTargetStatusTagProps {
  status: ReportTargetStatus;
  // Number of reports still to handle, shown before « À traiter »
  pendingCount?: number;
}

export function ReportTargetStatusTag({
  status,
  pendingCount,
}: ReportTargetStatusTagProps) {
  const isPending = status === 'PENDING';
  return (
    <Badge
      size="small"
      variant={
        isPending ? BadgeVariant.ExtraLightAmber : BadgeVariant.ExtraLightGreen
      }
    >
      {isPending && pendingCount
        ? REPORTS_TAB_LABELS.formatPendingCount(pendingCount)
        : REPORT_TARGET_STATUS_LABELS[status]}
    </Badge>
  );
}
