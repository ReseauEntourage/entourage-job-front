import React from 'react';
import { Tag, TagSize } from '@/src/components/ui';
import { formatReportReason } from '../reports.labels';
import { StyledReportTargetReasons } from './ReportTargetRow.styles';

export function ReportTargetReasons({ reasons }: { reasons: string[] }) {
  return (
    <StyledReportTargetReasons>
      {reasons.map((reason) => (
        <Tag key={reason} size={TagSize.Small}>
          {formatReportReason(reason)}
        </Tag>
      ))}
    </StyledReportTargetReasons>
  );
}
