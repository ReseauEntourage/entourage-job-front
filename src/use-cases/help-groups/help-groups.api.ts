import { isAxiosError } from 'axios';
import { Api } from '@/src/api';
import {
  CursorPage,
  HelpGroupAdminAction,
  HelpGroupAdminItem,
  HelpGroupCard,
  HelpGroupDiscussion,
  HelpGroupDiscussionItem,
  HelpGroupDto,
  HelpGroupPage,
  HelpGroupReply,
} from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';

export enum HelpGroupsError {
  NOT_FOUND = 'NOT_FOUND',
  FETCH_FAILED = 'FETCH_FAILED',
  MUTATION_FAILED = 'MUTATION_FAILED',
}

export const HELP_GROUPS_TAG = 'HelpGroups';

export const DISCUSSIONS_PAGE_SIZE = 20;
export const REPLIES_PAGE_SIZE = 50;

// An unpublished, deleted or unknown group (or discussion) is a 404
const toReadError = (error: unknown): HelpGroupsError =>
  isAxiosError(error) && error.response?.status === 404
    ? HelpGroupsError.NOT_FOUND
    : HelpGroupsError.FETCH_FAILED;

const readQuery =
  <TArgs, TData>(call: (args: TArgs) => Promise<{ data: TData }>) =>
  async (args: TArgs) => {
    try {
      const { data } = await call(args);
      return { data };
    } catch (error) {
      return { error: toReadError(error) };
    }
  };

const adminMutation =
  <TArgs>(call: (args: TArgs) => Promise<unknown>) =>
  async (args: TArgs) => {
    try {
      await call(args);
      return { data: undefined };
    } catch {
      return { error: HelpGroupsError.MUTATION_FAILED };
    }
  };

const helpGroupsTaggedApi = api.enhanceEndpoints({
  addTagTypes: [HELP_GROUPS_TAG],
});

/**
 * Every admin mutation invalidates the whole `HelpGroups` tag: the number of
 * groups is small and an admin change can affect the catalog, a group page
 * and its discussions at once.
 */
export const helpGroupsApi = helpGroupsTaggedApi.injectEndpoints({
  endpoints: (builder) => ({
    getHelpGroups: builder.query<HelpGroupCard[], void>({
      queryFn: readQuery(() => Api.getHelpGroups()),
      providesTags: [HELP_GROUPS_TAG],
    }),

    getHelpGroup: builder.query<HelpGroupPage, string>({
      queryFn: readQuery((slug: string) => Api.getHelpGroup(slug)),
      providesTags: [HELP_GROUPS_TAG],
    }),

    getHelpGroupDiscussions: builder.infiniteQuery<
      CursorPage<HelpGroupDiscussionItem>,
      string,
      string | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
      queryFn: async ({ queryArg: slug, pageParam }) =>
        readQuery(() =>
          Api.getHelpGroupDiscussions(slug, {
            limit: DISCUSSIONS_PAGE_SIZE,
            ...(pageParam ? { cursor: pageParam } : {}),
          })
        )(undefined),
      providesTags: [HELP_GROUPS_TAG],
    }),

    getHelpGroupDiscussion: builder.query<
      HelpGroupDiscussion,
      { slug: string; discussionId: string }
    >({
      queryFn: readQuery(({ slug, discussionId }) =>
        Api.getHelpGroupDiscussion(slug, discussionId)
      ),
      providesTags: [HELP_GROUPS_TAG],
    }),

    getHelpGroupDiscussionReplies: builder.infiniteQuery<
      CursorPage<HelpGroupReply>,
      { slug: string; discussionId: string },
      string | null
    >({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
      queryFn: async ({ queryArg: { slug, discussionId }, pageParam }) =>
        readQuery(() =>
          Api.getHelpGroupDiscussionReplies(slug, discussionId, {
            limit: REPLIES_PAGE_SIZE,
            ...(pageParam ? { after: pageParam } : {}),
          })
        )(undefined),
      providesTags: [HELP_GROUPS_TAG],
    }),

    getAdminHelpGroups: builder.query<HelpGroupAdminItem[], boolean>({
      queryFn: readQuery((deleted: boolean) => Api.getAdminHelpGroups(deleted)),
      providesTags: [HELP_GROUPS_TAG],
    }),

    createHelpGroup: builder.mutation<void, HelpGroupDto>({
      queryFn: adminMutation((dto: HelpGroupDto) =>
        Api.postAdminHelpGroup(dto)
      ),
      invalidatesTags: [HELP_GROUPS_TAG],
    }),

    updateHelpGroup: builder.mutation<void, { id: string; dto: HelpGroupDto }>({
      queryFn: adminMutation(({ id, dto }: { id: string; dto: HelpGroupDto }) =>
        Api.putAdminHelpGroup(id, dto)
      ),
      invalidatesTags: [HELP_GROUPS_TAG],
    }),

    runHelpGroupAction: builder.mutation<
      void,
      { id: string; action: HelpGroupAdminAction }
    >({
      queryFn: adminMutation(
        ({ id, action }: { id: string; action: HelpGroupAdminAction }) =>
          Api.postAdminHelpGroupAction(id, action)
      ),
      invalidatesTags: [HELP_GROUPS_TAG],
    }),

    deleteHelpGroup: builder.mutation<void, string>({
      queryFn: adminMutation((id: string) => Api.deleteAdminHelpGroup(id)),
      invalidatesTags: [HELP_GROUPS_TAG],
    }),
  }),
});

export const {
  useGetHelpGroupsQuery,
  useGetHelpGroupQuery,
  useGetHelpGroupDiscussionsInfiniteQuery,
  useGetHelpGroupDiscussionQuery,
  useGetHelpGroupDiscussionRepliesInfiniteQuery,
  useGetAdminHelpGroupsQuery,
  useCreateHelpGroupMutation,
  useUpdateHelpGroupMutation,
  useRunHelpGroupActionMutation,
  useDeleteHelpGroupMutation,
} = helpGroupsApi;
