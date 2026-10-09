import { Api } from '@/src/api';
import {
  CursorPage,
  ReportConversationMessagesPage,
  ReportTargetDetail,
  ReportTargetItem,
  ReportTargetsParams,
  ReportTargetType,
} from '@/src/api/types';
import { AdminZone } from '@/src/constants/departements';
import { api } from '@/src/store/api/api.slice';

export const REPORTS_TAG = 'Reports';

export enum ReportsError {
  NOT_FOUND = 'NOT_FOUND',
  FAILED = 'FAILED',
}

const toError = (error: unknown): ReportsError =>
  (error as { response?: { status?: number } })?.response?.status === 404
    ? ReportsError.NOT_FOUND
    : ReportsError.FAILED;

// `queryFn` never throws: a failure is a typed error
const read = async <T>(call: () => Promise<{ data: T }>) => {
  try {
    const { data } = await call();
    return { data };
  } catch (error) {
    return { error: toError(error) };
  }
};

type ReportTarget = { targetType: ReportTargetType; targetId: string };

/**
 * "Signalements" admin tab: reported targets, page of a target, read only
 * messages of a reported conversation, closing, and the menu badge.
 */
export const reportsApi = api
  .enhanceEndpoints({ addTagTypes: [REPORTS_TAG] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAdminReportTargets: builder.infiniteQuery<
        CursorPage<ReportTargetItem>,
        Omit<ReportTargetsParams, 'cursor'>,
        string | null
      >({
        infiniteQueryOptions: {
          initialPageParam: null,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
        queryFn: ({ queryArg, pageParam }) =>
          read(() =>
            Api.getAdminReportTargets({
              ...queryArg,
              ...(pageParam ? { cursor: pageParam } : {}),
            })
          ),
        providesTags: [REPORTS_TAG],
      }),

      getAdminReportTarget: builder.query<ReportTargetDetail, ReportTarget>({
        queryFn: ({ targetType, targetId }) =>
          read(() => Api.getAdminReportTarget(targetType, targetId)),
        providesTags: [REPORTS_TAG],
      }),

      // Older pages through `before`, the most recent messages first
      getAdminReportedConversationMessages: builder.infiniteQuery<
        ReportConversationMessagesPage,
        string,
        string | null
      >({
        infiniteQueryOptions: {
          initialPageParam: null,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
        queryFn: ({ queryArg: conversationId, pageParam }) =>
          read(() =>
            Api.getAdminReportedConversationMessages(
              conversationId,
              pageParam ?? undefined
            )
          ),
      }),

      resolveAdminReportTarget: builder.mutation<
        { resolvedCount: number },
        ReportTarget & { note?: string }
      >({
        queryFn: ({ targetType, targetId, note }) =>
          read(() =>
            Api.postAdminReportTargetResolve(targetType, targetId, {
              ...(note ? { note } : {}),
            })
          ),
        // The list, the page and the badge are refreshed after a closing
        invalidatesTags: (_result, error) => (error ? [] : [REPORTS_TAG]),
      }),

      getAdminReportsPendingCount: builder.query<
        number,
        AdminZone | null | undefined
      >({
        queryFn: async (zone) => {
          const result = await read(() =>
            Api.getAdminReportsPendingCount(zone)
          );
          return 'error' in result
            ? { error: result.error }
            : { data: result.data.count };
        },
        providesTags: [REPORTS_TAG],
      }),
    }),
  });

export const {
  useGetAdminReportTargetsInfiniteQuery,
  useGetAdminReportTargetQuery,
  useGetAdminReportedConversationMessagesInfiniteQuery,
  useResolveAdminReportTargetMutation,
  useGetAdminReportsPendingCountQuery,
} = reportsApi;
