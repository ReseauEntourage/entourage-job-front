import React from 'react';
import { Text } from '@/src/components/ui';
import { ReportTargetStatusTag } from '../ReportTargetStatusTag';
import {
  formatReportDate,
  formatReportZone,
  REPORT_TARGET_TYPE_LABELS,
  REPORT_TARGET_TYPE_SHORT_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { getReportTargetHref } from '../reports.utils';
import { ReportTargetReasons } from './ReportTargetReasons';
import {
  StyledReportTargetCard,
  StyledReportTargetLabel,
  StyledReportTargetLast,
  StyledReportTargetMain,
  StyledReportTargetStatus,
  StyledReportTargetTypeIcon,
} from './ReportTargetRow.styles';
import { ReportTargetRowProps } from './ReportTargetRow.types';

export function ReportTargetRowDesktop({ target }: ReportTargetRowProps) {
  const zones = target.zones.map(formatReportZone).join(', ');
  return (
    <StyledReportTargetCard
      href={getReportTargetHref(target.targetType, target.targetId)}
    >
      <StyledReportTargetTypeIcon $targetType={target.targetType} aria-hidden>
        {REPORT_TARGET_TYPE_SHORT_LABELS[target.targetType]}
      </StyledReportTargetTypeIcon>
      <StyledReportTargetMain>
        <Text size="small" color="darkGray">
          {[REPORT_TARGET_TYPE_LABELS[target.targetType], zones]
            .filter(Boolean)
            .join(' · ')}
        </Text>
        <StyledReportTargetLabel>
          <Text weight="semibold" size="large">
            {target.label}
          </Text>
        </StyledReportTargetLabel>
        <ReportTargetReasons reasons={target.reasons} />
      </StyledReportTargetMain>
      <StyledReportTargetLast>
        <Text size="small" color="darkGray">
          {REPORTS_TAB_LABELS.lastReport}
        </Text>
        <Text>{formatReportDate(target.lastReportedAt)}</Text>
      </StyledReportTargetLast>
      <StyledReportTargetStatus>
        <ReportTargetStatusTag
          status={target.status}
          pendingCount={target.pendingCount}
        />
      </StyledReportTargetStatus>
    </StyledReportTargetCard>
  );
}
