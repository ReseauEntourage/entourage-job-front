import React, { useRef } from 'react';
import { SelectSimple } from '@/src/components/ui/Inputs';
import { ADMIN_ZONES_FILTERS } from '@/src/constants/departements';
import {
  REPORT_TARGET_FILTER_LABELS,
  REPORT_TARGET_STATUS_LABELS,
  REPORTS_TAB_LABELS,
} from '../reports.labels';
import { ALL_FILTER_VALUE } from '../reports.utils';
import { ReportFilterKey, ReportFilterValues } from '../useReportFilters';
import {
  StyledReportFilters,
  StyledReportSelects,
  StyledReportTypePill,
  StyledReportTypePills,
} from './ReportTargetFilters.styles';

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

/**
 * The type as pills (a radio group, arrow keys move the choice), the status
 * and the zone as selects. Every value is kept in the URL.
 */
export function ReportTargetFilters({
  values,
  onChange,
}: ReportTargetFiltersProps) {
  const pillsRef = useRef<HTMLDivElement>(null);

  const onPillsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[
      event.key
    ];
    if (!step) {
      return;
    }
    event.preventDefault();
    const index = TYPE_OPTIONS.findIndex(({ value }) => value === values.type);
    const next =
      TYPE_OPTIONS[(index + step + TYPE_OPTIONS.length) % TYPE_OPTIONS.length];
    onChange('type', next.value);
    pillsRef.current
      ?.querySelector<HTMLButtonElement>(`#report-filter-type-${next.value}`)
      ?.focus();
  };

  return (
    <StyledReportFilters data-testid="report-filters">
      <StyledReportTypePills
        ref={pillsRef}
        role="radiogroup"
        aria-label={REPORTS_TAB_LABELS.typeFilter}
        onKeyDown={onPillsKeyDown}
      >
        {TYPE_OPTIONS.map(({ value, label }) => {
          const isChecked = values.type === value;
          return (
            <StyledReportTypePill
              key={value}
              id={`report-filter-type-${value}`}
              type="button"
              role="radio"
              aria-checked={isChecked}
              tabIndex={isChecked ? 0 : -1}
              $isChecked={isChecked}
              onClick={() => onChange('type', value)}
            >
              {label}
            </StyledReportTypePill>
          );
        })}
      </StyledReportTypePills>
      <StyledReportSelects>
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
      </StyledReportSelects>
    </StyledReportFilters>
  );
}
