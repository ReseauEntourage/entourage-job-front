import React from 'react';
import { SelectSimple } from '@/src/components/ui/Inputs';
import { ADMIN_ZONES_FILTERS } from '@/src/constants/departements';
import {
  REPORT_TARGET_FILTER_LABELS,
  REPORT_TARGET_STATUS_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { ALL_FILTER_VALUE } from '../reports.utils';
import { ReportFilterKey, ReportFilterValues } from '../useReportFilters';
import { StyledReportFilters } from './ReportTargetList.styles';

const toOptions = (labels: Record<string, string>, allLabel: string) => [
  { value: ALL_FILTER_VALUE, label: allLabel },
  ...Object.entries(labels).map(([value, label]) => ({ value, label })),
];

const TYPE_OPTIONS = toOptions(
  REPORT_TARGET_FILTER_LABELS,
  REPORTS_TAB_LABELS.allTypes
);
const STATUS_OPTIONS = toOptions(
  REPORT_TARGET_STATUS_LABELS,
  REPORTS_TAB_LABELS.allStatuses
);
const ZONE_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: REPORTS_TAB_LABELS.allZones },
  ...ADMIN_ZONES_FILTERS.map(({ value, label }) => ({ value, label })),
];

interface ReportTargetFiltersProps {
  values: ReportFilterValues;
  onChange: (key: ReportFilterKey, value: string) => void;
}

export function ReportTargetFilters({
  values,
  onChange,
}: ReportTargetFiltersProps) {
  return (
    <StyledReportFilters data-testid="report-filters">
      <SelectSimple
        id="report-filter-type"
        name="report-filter-type"
        title={REPORTS_TAB_LABELS.typeFilter}
        showLabel
        options={TYPE_OPTIONS}
        value={values.type}
        onChange={(value) => onChange('type', value as string)}
      />
      <SelectSimple
        id="report-filter-status"
        name="report-filter-status"
        title={REPORTS_TAB_LABELS.statusFilter}
        showLabel
        options={STATUS_OPTIONS}
        value={values.status}
        onChange={(value) => onChange('status', value as string)}
      />
      <SelectSimple
        id="report-filter-zone"
        name="report-filter-zone"
        title={REPORTS_TAB_LABELS.zoneFilter}
        showLabel
        options={ZONE_OPTIONS}
        value={values.zone}
        onChange={(value) => onChange('zone', value as string)}
      />
    </StyledReportFilters>
  );
}
