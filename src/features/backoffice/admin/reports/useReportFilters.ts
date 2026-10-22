import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import {
  ReportTargetFilter,
  ReportTargetsParams,
  ReportTargetStatus,
} from '@/src/api/types';
import { AdminZone } from '@/src/constants/departements';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { ALL_FILTER_VALUE, REPORTS_PATH } from './reports.utils';

export type ReportFilterKey = 'type' | 'status' | 'zone';

export interface ReportFilterValues {
  type: ReportTargetFilter | typeof ALL_FILTER_VALUE;
  status: ReportTargetStatus | typeof ALL_FILTER_VALUE;
  zone: AdminZone | typeof ALL_FILTER_VALUE;
}

const readQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/**
 * Filters of the reports list, kept in the URL. Without a value in the URL,
 * the status is "À traiter" and the zone is the zone of the admin, like the
 * members list; `ALL` keeps a removed filter removed.
 */
export function useReportFilters() {
  const { query, push } = useRouter();
  const user = useAuthenticatedUser();

  const values = useMemo<ReportFilterValues>(
    () => ({
      type: (readQueryValue(query.type) ??
        ALL_FILTER_VALUE) as ReportFilterValues['type'],
      status: (readQueryValue(query.status) ??
        'PENDING') as ReportFilterValues['status'],
      zone: (readQueryValue(query.zone) ??
        user?.zone ??
        ALL_FILTER_VALUE) as ReportFilterValues['zone'],
    }),
    [query.status, query.type, query.zone, user?.zone]
  );

  const params = useMemo<Omit<ReportTargetsParams, 'cursor'>>(
    () => ({
      ...(values.type !== ALL_FILTER_VALUE ? { type: values.type } : {}),
      ...(values.status !== ALL_FILTER_VALUE ? { status: values.status } : {}),
      ...(values.zone !== ALL_FILTER_VALUE ? { zone: values.zone } : {}),
    }),
    [values]
  );

  const setFilter = useCallback(
    (key: ReportFilterKey, value: string) => {
      push(
        { pathname: REPORTS_PATH, query: { ...values, [key]: value } },
        undefined,
        { shallow: true, scroll: false }
      );
    },
    [push, values]
  );

  return { values, params, setFilter };
}
