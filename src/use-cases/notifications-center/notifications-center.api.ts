import { Api } from '@/src/api';
import { CursorPage, NotificationItem } from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';

export enum NotificationsCenterError {
  FETCH_FAILED = 'FETCH_FAILED',
  MUTATION_FAILED = 'MUTATION_FAILED',
}

/**
 * The bell: invalidated by the Pusher signal of the user channel and by the
 * "seen" marking. Not to be confused with the `notifications` slice, which
 * holds the toasts.
 */
export const NOTIFICATIONS_CENTER_TAG = 'Notifications';

const notificationsCenterTaggedApi = api.enhanceEndpoints({
  addTagTypes: [NOTIFICATIONS_CENTER_TAG],
});

export const notificationsCenterApi =
  notificationsCenterTaggedApi.injectEndpoints({
    endpoints: (builder) => ({
      getNotifications: builder.infiniteQuery<
        CursorPage<NotificationItem>,
        void,
        string | null
      >({
        infiniteQueryOptions: {
          initialPageParam: null,
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
        queryFn: async ({ pageParam }) => {
          try {
            const { data } = await Api.getNotifications(
              pageParam ? { cursor: pageParam } : {}
            );
            return { data };
          } catch {
            return { error: NotificationsCenterError.FETCH_FAILED };
          }
        },
        providesTags: [NOTIFICATIONS_CENTER_TAG],
      }),

      getNotificationsUnseenCount: builder.query<number, void>({
        queryFn: async () => {
          try {
            const { data } = await Api.getNotificationsUnseenCount();
            return { data: data.count };
          } catch {
            return { error: NotificationsCenterError.FETCH_FAILED };
          }
        },
        providesTags: [NOTIFICATIONS_CENTER_TAG],
      }),

      /**
       * Messages actually displayed on the screen: the back marks seen the
       * events they cover.
       */
      markNotificationsSeen: builder.mutation<void, string[]>({
        queryFn: async (messageIds) => {
          try {
            await Api.postNotificationsSeen({ messageIds });
            return { data: undefined };
          } catch {
            return { error: NotificationsCenterError.MUTATION_FAILED };
          }
        },
        invalidatesTags: [NOTIFICATIONS_CENTER_TAG],
      }),
    }),
  });

export const {
  useGetNotificationsInfiniteQuery,
  useGetNotificationsUnseenCountQuery,
  useMarkNotificationsSeenMutation,
} = notificationsCenterApi;
