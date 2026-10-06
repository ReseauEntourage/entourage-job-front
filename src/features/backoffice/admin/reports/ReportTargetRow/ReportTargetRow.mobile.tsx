import React from 'react';
import { SimpleLink, Text } from '@/src/components/ui';
import { TdMobile, TrMobile } from '@/src/components/ui/Table';
import {
  formatReportDate,
  formatReportReason,
  formatReportZone,
  REPORT_TARGET_TYPE_LABELS,
} from '../reports.labels';
import { getReportTargetHref } from '../reports.utils';
import { ReportTargetRowProps } from './ReportTargetRow.types';
import { ReportTargetStatusTag } from './ReportTargetStatusTag';

export function ReportTargetRowMobile({ target }: ReportTargetRowProps) {
  return (
    <TrMobile>
      <div className="line">
        <TdMobile>
          <SimpleLink
            href={getReportTargetHref(target.targetType, target.targetId)}
          >
            <Text weight="semibold">{target.label}</Text>
          </SimpleLink>
          <ReportTargetStatusTag status={target.status} />
        </TdMobile>
      </div>
      <div className="line">
        <TdMobile title="Type">
          <Text>{REPORT_TARGET_TYPE_LABELS[target.targetType]}</Text>
        </TdMobile>
        <TdMobile title="Zone">
          <Text>{target.zones.map(formatReportZone).join(', ') || '-'}</Text>
        </TdMobile>
      </div>
      <div className="line">
        <TdMobile title="À traiter">
          <Text>{target.pendingCount}</Text>
        </TdMobile>
        <TdMobile title="Dernier signalement">
          <Text>{formatReportDate(target.lastReportedAt)}</Text>
        </TdMobile>
      </div>
      <div className="line">
        <TdMobile title="Motifs">
          <Text>{target.reasons.map(formatReportReason).join(', ')}</Text>
        </TdMobile>
      </div>
    </TrMobile>
  );
}
