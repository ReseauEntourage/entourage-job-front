import { isAxiosError } from 'axios';
import { Api } from '@/src/api';
import {
  CursorPage,
  HelpGroupAdminAction,
  HelpGroupDiscussionDto,
  HelpGroupMessageRevisions,
  HelpGroupModerationDto,
  HelpGroupReactionEmoji,
  HelpGroupReactionResult,
  HelpGroupReactionTarget,
  HelpGroupReplyDto,
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
// Only the discussions list of a group: a new or deleted reply moves its
// discussion (last activity), a discussion edition changes its title, without
// reloading the open discussion. A reply edition changes neither.
export const HELP_GROUP_DISCUSSIONS_LIST_TAG = 'HelpGroupDiscussionsList';

/**
 * Typed failures of a write, from the back error codes, so that each one
 * gets its own message (or flow, for the charter).
 */
export enum HelpGroupsWriteError {
  NOT_MEMBER = 'NOT_MEMBER',
  ELEARNING_NOT_COMPLETED = 'ELEARNING_NOT_COMPLETED',
  CHARTER_NOT_ACCEPTED = 'CHARTER_NOT_ACCEPTED',
  DISCUSSION_NOT_FOUND = 'DISCUSSION_NOT_FOUND',
  NOT_FOUND = 'NOT_FOUND',
  INVALID = 'INVALID',
  FAILED = 'FAILED',
}

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

export const toWriteError = (error: unknown): HelpGroupsWriteError => {
  if (!isAxiosError(error) || !error.response) {
    return HelpGroupsWriteError.FAILED;
  }
  const { status, data } = error.response;
  const code = (data as { message?: unknown } | undefined)?.message;
  if (status === 409) {
    return HelpGroupsWriteError.CHARTER_NOT_ACCEPTED;
  }
  if (status === 403 && code === 'ELEARNING_NOT_COMPLETED') {
    return HelpGroupsWriteError.ELEARNING_NOT_COMPLETED;
  }
  if (status === 403 && code === 'HELP_GROUP_NOT_MEMBER') {
    return HelpGroupsWriteError.NOT_MEMBER;
  }
  if (status === 404) {
    return code === 'HELP_GROUP_DISCUSSION_NOT_FOUND'
      ? HelpGroupsWriteError.DISCUSSION_NOT_FOUND
      : HelpGroupsWriteError.NOT_FOUND;
  }
  if (status === 400) {
    return HelpGroupsWriteError.INVALID;
  }
  return HelpGroupsWriteError.FAILED;
};

const writeMutation =
  <TArgs, TData>(call: (args: TArgs) => Promise<{ data: TData }>) =>
  async (args: TArgs) => {
    try {
      const { data } = await call(args);
      return { data };
    } catch (error) {
      return { error: toWriteError(error) };
    }
  };

type DiscussionArgs = { slug: string; discussionId: string };

type ReactionArgs = DiscussionArgs & {
  target: HelpGroupReactionTarget;
  // Applied optimistically before the response
  emoji: HelpGroupReactionEmoji | null;
  viewerFirstName: string;
};

const helpGroupsTaggedApi = api.enhanceEndpoints({
  addTagTypes: [HELP_GROUPS_TAG, HELP_GROUP_DISCUSSIONS_LIST_TAG],
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
      providesTags: [HELP_GROUPS_TAG, HELP_GROUP_DISCUSSIONS_LIST_TAG],
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

    joinHelpGroup: builder.mutation<unknown, string>({
      queryFn: writeMutation((slug: string) =>
        Api.postHelpGroupMembership(slug)
      ),
      invalidatesTags: [HELP_GROUPS_TAG],
    }),

    leaveHelpGroup: builder.mutation<unknown, string>({
      queryFn: writeMutation((slug: string) =>
        Api.deleteHelpGroupMembership(slug)
      ),
      invalidatesTags: [HELP_GROUPS_TAG],
    }),

    createHelpGroupDiscussion: builder.mutation<
      HelpGroupDiscussion,
      { slug: string; dto: HelpGroupDiscussionDto }
    >({
      queryFn: writeMutation(
        ({ slug, dto }: { slug: string; dto: HelpGroupDiscussionDto }) =>
          Api.postHelpGroupDiscussion(slug, dto)
      ),
      // The page (charter acceptance, welcome invite) and the list change
      invalidatesTags: (_result, error) => (error ? [] : [HELP_GROUPS_TAG]),
    }),

    suggestHelpGroupTitle: builder.mutation<
      { title: string | null },
      { slug: string; content: string; previousTitles: string[] }
    >({
      queryFn: writeMutation(
        ({
          slug,
          content,
          previousTitles,
        }: {
          slug: string;
          content: string;
          previousTitles: string[];
        }) =>
          Api.postHelpGroupTitleSuggestion(slug, { content, previousTitles })
      ),
    }),

    updateHelpGroupDiscussion: builder.mutation<
      HelpGroupDiscussion,
      DiscussionArgs & { dto: { title?: string; content?: string } }
    >({
      queryFn: writeMutation(
        ({
          slug,
          discussionId,
          dto,
        }: DiscussionArgs & { dto: { title?: string; content?: string } }) =>
          Api.patchHelpGroupDiscussion(slug, discussionId, dto)
      ),
      async onQueryStarted(
        { slug, discussionId },
        { dispatch, queryFulfilled }
      ) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) {
          dispatch(
            helpGroupsApi.util.upsertQueryData(
              'getHelpGroupDiscussion',
              { slug, discussionId },
              data
            )
          );
        }
      },
      invalidatesTags: (_result, error) =>
        error ? [] : [HELP_GROUP_DISCUSSIONS_LIST_TAG],
    }),

    deleteHelpGroupDiscussion: builder.mutation<unknown, DiscussionArgs>({
      queryFn: writeMutation(({ slug, discussionId }: DiscussionArgs) =>
        Api.deleteHelpGroupDiscussion(slug, discussionId)
      ),
      invalidatesTags: (_result, error) =>
        error ? [] : [HELP_GROUP_DISCUSSIONS_LIST_TAG],
    }),

    createHelpGroupReply: builder.mutation<
      HelpGroupReply,
      DiscussionArgs & { dto: HelpGroupReplyDto }
    >({
      queryFn: writeMutation(
        ({
          slug,
          discussionId,
          dto,
        }: DiscussionArgs & { dto: HelpGroupReplyDto }) =>
          Api.postHelpGroupReply(slug, discussionId, dto)
      ),
      async onQueryStarted(
        { slug, discussionId },
        { dispatch, queryFulfilled }
      ) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) {
          dispatch(appendReply({ slug, discussionId }, data));
          dispatch(
            helpGroupsApi.util.updateQueryData(
              'getHelpGroupDiscussion',
              { slug, discussionId },
              (draft) => {
                draft.repliesCount += 1;
              }
            )
          );
        }
      },
      // The charter may just have been accepted, and the list is reordered
      invalidatesTags: (_result, error) =>
        error ? [] : [HELP_GROUP_DISCUSSIONS_LIST_TAG],
    }),

    updateHelpGroupReply: builder.mutation<
      HelpGroupReply,
      DiscussionArgs & { replyId: string; content: string }
    >({
      queryFn: writeMutation(
        ({
          slug,
          discussionId,
          replyId,
          content,
        }: DiscussionArgs & { replyId: string; content: string }) =>
          Api.patchHelpGroupReply(slug, discussionId, replyId, { content })
      ),
      async onQueryStarted(
        { slug, discussionId },
        { dispatch, queryFulfilled }
      ) {
        const { data } = await queryFulfilled.catch(() => ({ data: null }));
        if (data) {
          dispatch(
            updateReplies({ slug, discussionId }, (reply) =>
              reply.id === data.id ? data : reply
            )
          );
        }
      },
    }),

    deleteHelpGroupReply: builder.mutation<
      unknown,
      DiscussionArgs & { replyId: string }
    >({
      queryFn: writeMutation(
        ({
          slug,
          discussionId,
          replyId,
        }: DiscussionArgs & { replyId: string }) =>
          Api.deleteHelpGroupReply(slug, discussionId, replyId)
      ),
      async onQueryStarted(
        { slug, discussionId, replyId },
        { dispatch, queryFulfilled }
      ) {
        const isDone = await queryFulfilled.then(
          () => true,
          () => false
        );
        if (isDone) {
          dispatch(removeReply({ slug, discussionId }, replyId));
          dispatch(decrementRepliesCount({ slug, discussionId }));
        }
      },
      invalidatesTags: (_result, error) =>
        error ? [] : [HELP_GROUP_DISCUSSIONS_LIST_TAG],
    }),

    /**
     * Optimistic: the summary shows the viewer's choice at once, then the
     * server summary replaces it, or the previous state comes back.
     */
    setHelpGroupReaction: builder.mutation<
      HelpGroupReactionResult,
      ReactionArgs
    >({
      queryFn: writeMutation(
        ({ slug, discussionId, target, emoji }: ReactionArgs) =>
          emoji
            ? Api.putHelpGroupReaction(slug, discussionId, { target, emoji })
            : Api.deleteHelpGroupReaction(slug, discussionId, { target })
      ),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patches = applyReactionToCache(dispatch, args, (previous) => ({
          viewerReaction: args.emoji,
          reactionsSummary: applyViewerReaction(
            previous.reactionsSummary,
            previous.viewerReaction,
            args.emoji,
            args.viewerFirstName
          ),
        }));
        try {
          const { data } = await queryFulfilled;
          applyReactionToCache(dispatch, args, () => ({
            viewerReaction: data.viewerReaction,
            reactionsSummary: data.reactionsSummary,
          }));
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),

    deleteHelpGroupMessageAsAdmin: builder.mutation<
      unknown,
      {
        kind: 'discussions' | 'replies';
        id: string;
        dto: HelpGroupModerationDto;
      } & Partial<DiscussionArgs>
    >({
      queryFn: writeMutation(
        ({
          kind,
          id,
          dto,
        }: {
          kind: 'discussions' | 'replies';
          id: string;
          dto: HelpGroupModerationDto;
        }) => Api.deleteAdminHelpGroupMessage(kind, id, dto)
      ),
      async onQueryStarted(
        { kind, id, slug, discussionId },
        { dispatch, queryFulfilled }
      ) {
        const isDone = await queryFulfilled.then(
          () => true,
          () => false
        );
        if (isDone && kind === 'replies' && slug && discussionId) {
          dispatch(removeReply({ slug, discussionId }, id));
          dispatch(decrementRepliesCount({ slug, discussionId }));
        }
      },
      invalidatesTags: (_result, error) =>
        error ? [] : [HELP_GROUP_DISCUSSIONS_LIST_TAG],
    }),

    getHelpGroupMessageRevisions: builder.query<
      HelpGroupMessageRevisions,
      { kind: 'discussions' | 'replies'; id: string }
    >({
      queryFn: readQuery(
        ({ kind, id }: { kind: 'discussions' | 'replies'; id: string }) =>
          Api.getAdminHelpGroupMessageRevisions(kind, id)
      ),
      keepUnusedDataFor: 0,
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

type RepliesCacheKey = DiscussionArgs;

const updateReplies = (
  key: RepliesCacheKey,
  map: (reply: HelpGroupReply) => HelpGroupReply | null
) =>
  helpGroupsApi.util.updateQueryData(
    'getHelpGroupDiscussionReplies',
    key,
    (draft) => {
      draft.pages.forEach((page) => {
        page.items = page.items
          .map(map)
          .filter((reply): reply is HelpGroupReply => reply !== null);
      });
    }
  );

/**
 * Adds a reply at the end of the loaded thread, once: the realtime event of
 * one's own reply finds it already there.
 */
export const appendReply = (key: RepliesCacheKey, reply: HelpGroupReply) =>
  helpGroupsApi.util.updateQueryData(
    'getHelpGroupDiscussionReplies',
    key,
    (draft) => {
      const alreadyLoaded = draft.pages.some((page) =>
        page.items.some(({ id }) => id === reply.id)
      );
      const lastPage = draft.pages[draft.pages.length - 1];
      // While more pages remain, the reply arrives with the last page
      if (!alreadyLoaded && lastPage && !lastPage.nextCursor) {
        lastPage.items.push(reply);
      }
    }
  );

export const removeReply = (key: RepliesCacheKey, replyId: string) =>
  updateReplies(key, (reply) => (reply.id === replyId ? null : reply));

const decrementRepliesCount = (key: RepliesCacheKey) =>
  helpGroupsApi.util.updateQueryData('getHelpGroupDiscussion', key, (draft) => {
    draft.repliesCount = Math.max(0, draft.repliesCount - 1);
  });

type ReactionState = Pick<
  HelpGroupReactionResult,
  'reactionsSummary' | 'viewerReaction'
>;

/**
 * Viewer's change applied to a summary before the server answers: the
 * chosen emoji is shown with the viewer's first name. On a removal, the
 * other people's emojis are unknown: they stay until the server summary.
 */
export const applyViewerReaction = (
  summary: HelpGroupReactionResult['reactionsSummary'],
  previousEmoji: HelpGroupReactionEmoji | null,
  emoji: HelpGroupReactionEmoji | null,
  viewerFirstName: string
): HelpGroupReactionResult['reactionsSummary'] => {
  const firstNames = (summary?.firstNames ?? []).filter(
    (firstName) => firstName !== viewerFirstName
  );
  const hasOthers = summary?.hasOthers ?? false;
  if (!emoji) {
    if (firstNames.length === 0 && !hasOthers) {
      return null;
    }
    return {
      emojis: (summary?.emojis ?? []).filter(
        (existing) =>
          existing !== previousEmoji || firstNames.length > 0 || hasOthers
      ),
      firstNames,
      hasOthers,
    };
  }
  const emojis = new Set(summary?.emojis ?? []);
  emojis.add(emoji);
  return {
    emojis: HELP_GROUP_REACTIONS.filter((existing) => emojis.has(existing)),
    firstNames:
      firstNames.length < 3 ? [...firstNames, viewerFirstName] : firstNames,
    hasOthers: firstNames.length >= 3 || hasOthers,
  };
};

// Order of the reactions palette, no thumb up
export const HELP_GROUP_REACTIONS: HelpGroupReactionEmoji[] = [
  '💪',
  '❤️',
  '👏',
  '🙌',
  '🎉',
];

const applyReactionToCache = (
  dispatch: (action: unknown) => unknown,
  { slug, discussionId, target }: ReactionArgs,
  next: (previous: ReactionState) => ReactionState
): { undo: () => void }[] => {
  if ('discussionId' in target) {
    return [
      dispatch(
        helpGroupsApi.util.updateQueryData(
          'getHelpGroupDiscussion',
          { slug, discussionId },
          (draft) => {
            Object.assign(draft, next(draft));
          }
        )
      ) as { undo: () => void },
    ];
  }
  return [
    dispatch(
      helpGroupsApi.util.updateQueryData(
        'getHelpGroupDiscussionReplies',
        { slug, discussionId },
        (draft) => {
          draft.pages.forEach((page) => {
            page.items.forEach((reply) => {
              if (reply.id === target.replyId) {
                Object.assign(reply, next(reply));
              }
            });
          });
        }
      )
    ) as { undo: () => void },
  ];
};

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
  useJoinHelpGroupMutation,
  useLeaveHelpGroupMutation,
  useCreateHelpGroupDiscussionMutation,
  useSuggestHelpGroupTitleMutation,
  useUpdateHelpGroupDiscussionMutation,
  useDeleteHelpGroupDiscussionMutation,
  useCreateHelpGroupReplyMutation,
  useUpdateHelpGroupReplyMutation,
  useDeleteHelpGroupReplyMutation,
  useSetHelpGroupReactionMutation,
  useDeleteHelpGroupMessageAsAdminMutation,
  useLazyGetHelpGroupMessageRevisionsQuery,
} = helpGroupsApi;
