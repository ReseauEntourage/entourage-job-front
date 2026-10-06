import React from 'react';
import { SimpleLink, Text } from '@/src/components/ui';
import { TdMobile, TrMobile } from '@/src/components/ui/Table';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  formatReportDate,
  formatReportReason,
  formatReportZone,
  REPORT_TARGET_TYPE_LABELS,
} from '../reports.labels';
import { getReportTargetHref } from '../reports.utils';
import { StyledReportTargetMobileLine } from './ReportTargetRow.styles';
import { ReportTargetRowProps } from './ReportTargetRow.types';

export function ReportTargetRowMobile({ target }: ReportTargetRowProps) {
  return (
    <TrMobile>
      <StyledReportTargetMobileLine className="line">
        <TdMobile>
          <SimpleLink
            href={getReportTargetHref(target.targetType, target.targetId)}
          >
            <Text weight="semibold">{target.label}</Text>
          </SimpleLink>
          <ReportTargetStatusTag status={target.status} />
        </TdMobile>
      </StyledReportTargetMobileLine>
      <StyledReportTargetMobileLine className="line">
        <TdMobile title="Type">
          <Text>{REPORT_TARGET_TYPE_LABELS[target.targetType]}</Text>
        </TdMobile>
        <TdMobile title="Zone">
          <Text>{target.zones.map(formatReportZone).join(', ') || '-'}</Text>
        </TdMobile>
      </StyledReportTargetMobileLine>
      <StyledReportTargetMobileLine className="line">
        <TdMobile title="À traiter">
          <Text>{target.pendingCount}</Text>
        </TdMobile>
        <TdMobile title="Dernier signalement">
          <Text>{formatReportDate(target.lastReportedAt)}</Text>
        </TdMobile>
      </StyledReportTargetMobileLine>
      <StyledReportTargetMobileLine className="line">
        <TdMobile title="Motifs">
          <Text>{target.reasons.map(formatReportReason).join(', ')}</Text>
        </TdMobile>
      </StyledReportTargetMobileLine>
    </TrMobile>
  );
}
