import React from 'react';
import { SimpleLink, Text } from '@/src/components/ui';
import { TdDesktop, TrDesktop } from '@/src/components/ui/Table';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  formatReportDate,
  formatReportReason,
  formatReportZone,
  REPORT_TARGET_TYPE_LABELS,
} from '../reports.labels';
import { getReportTargetHref } from '../reports.utils';
import { ReportTargetRowProps } from './ReportTargetRow.types';

export function ReportTargetRowDesktop({ target }: ReportTargetRowProps) {
  return (
    <TrDesktop>
      <TdDesktop>
        <Text>{REPORT_TARGET_TYPE_LABELS[target.targetType]}</Text>
      </TdDesktop>
      <TdDesktop>
        <SimpleLink
          href={getReportTargetHref(target.targetType, target.targetId)}
        >
          <Text weight="semibold">{target.label}</Text>
        </SimpleLink>
      </TdDesktop>
      <TdDesktop>
        <Text>{target.zones.map(formatReportZone).join(', ') || '-'}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{target.pendingCount}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{target.reasons.map(formatReportReason).join(', ')}</Text>
      </TdDesktop>
      <TdDesktop>
        <Text>{formatReportDate(target.lastReportedAt)}</Text>
      </TdDesktop>
      <TdDesktop>
        <ReportTargetStatusTag status={target.status} />
      </TdDesktop>
    </TrDesktop>
  );
}
