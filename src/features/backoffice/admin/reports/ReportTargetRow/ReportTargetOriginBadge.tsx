import React from 'react';
import { ReportOrigin } from '@/src/api/types';
import { Tag, TagSize, TagVariant } from '@/src/components/ui';
import { REPORTS_TAB_LABELS } from '../reports.labels';

/**
 * "Détecté automatiquement" badge, shown when at least one of the target's
 * reports has no human reporter.
 */
export function ReportTargetOriginBadge({
  origins,
}: {
  origins: ReportOrigin[];
}) {
  if (!origins.includes('AUTOMATIC')) {
    return null;
  }
  return (
    <Tag size={TagSize.Small} variant={TagVariant.DarkBlue}>
      {REPORTS_TAB_LABELS.automaticBadge}
    </Tag>
  );
}
