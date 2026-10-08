import React from 'react';
import { Text } from '@/src/components/ui';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  formatReportDate,
  formatReportZone,
  REPORT_TARGET_TYPE_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { getReportTargetHref } from '../reports.utils';
import { ReportTargetReasons } from './ReportTargetReasons';
import {
  StyledReportTargetCard,
  StyledReportTargetMobileHeader,
  StyledReportTargetTypeTag,
} from './ReportTargetRow.styles';
import { ReportTargetRowProps } from './ReportTargetRow.types';

export function ReportTargetRowMobile({ target }: ReportTargetRowProps) {
  const zones = target.zones.map(formatReportZone).join(', ');
  return (
    <StyledReportTargetCard
      $isMobile
      href={getReportTargetHref(target.targetType, target.targetId)}
    >
      <StyledReportTargetMobileHeader>
        <StyledReportTargetTypeTag $targetType={target.targetType}>
          {REPORT_TARGET_TYPE_LABELS[target.targetType]}
        </StyledReportTargetTypeTag>
        <ReportTargetStatusTag
          status={target.status}
          pendingCount={target.pendingCount}
        />
      </StyledReportTargetMobileHeader>
      <Text weight="semibold">{target.label}</Text>
      <ReportTargetReasons reasons={target.reasons} />
      <Text size="small" color="darkGray">
        {[
          zones,
          `${REPORTS_TAB_LABELS.lastReport.toLowerCase()} ${formatReportDate(
            target.lastReportedAt
          )}`,
        ]
          .filter(Boolean)
          .join(' · ')}
      </Text>
    </StyledReportTargetCard>
  );
}
