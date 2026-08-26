import { Api } from '@/src/api';
import { isMessagingDailyConversationLimitReachedError } from '@/src/api/axiosErrors';
import {
  Conversation,
  ConversationParticipant,
  ConversationParticipants,
  ConversationType,
  Message,
  MessageWithConversation,
} from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';
import { notificationsActions } from '../notifications';
import { slice } from './messaging.slice';

const { selectConversation } = slice.actions;

/**
 * Shared between the trigger listener (`messaging.listeners.ts`, which
 * triggers the mutation from the plain `postMessageRequested` action) and
 * `useWizardRedirects.ts` (which only needs to observe its result) — RTK
 * Query's documented pattern for this split.
 */
export const POST_MESSAGE_FIXED_CACHE_KEY = 'postMessage';

/**
 * Finds the existing direct conversation with the given participant, if
 * any. Translates the matching logic from `bindNewConversationSucceeded`.
 */
function findExistingDirectConversation(
  conversations: Conversation[] | undefined,
  participantId: string
) {
  return conversations?.find(
    (conv) =>
      conv.type === 'direct' &&
      conv.participants.find((p) => p.id === participantId)
  );
}

/** Builds the same client-only "new conversation" stub as the old reducer. */
function buildNewConversationStub(
  participants: ConversationParticipants
): Conversation {
  return {
    id: '',
    type:
      participants.length > 1
        ? ConversationType.GROUP
        : ConversationType.DIRECT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    participants,
  };
}

export const messagingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `getConversationsSagaRequested`. */
    getConversations: builder.query<Conversation[], void>({
      queryFn: async () => {
        try {
          const { data } = await Api.getConversations();
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    /** Translates `getUnseenConversationsCountSagaRequested`. */
    getUnseenConversationsCount: builder.query<number, void>({
      queryFn: async () => {
        try {
          const { data } = await Api.getUnseenConversationsCount();
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    /**
     * Translates `getSelectedConversationSagaRequested`. Never called with
     * the `'new'` sentinel id in practice (every call site guards against
     * it) — that cache entry is instead seeded directly by
     * `bindNewConversation`'s `onQueryStarted`.
     */
    getSelectedConversation: builder.query<Conversation, string>({
      queryFn: async (conversationId) => {
        try {
          const { data } = await Api.getConversationById(conversationId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (conversationId, { dispatch, queryFulfilled }) => {
        try {
          const { data: conversation } = await queryFulfilled;
          // Keep the lighter `getConversations` list item for this
          // conversation in sync, like the old reducer did.
          dispatch(
            messagingApi.util.updateQueryData(
              'getConversations',
              undefined,
              (draft) => {
                const idx = draft.findIndex((c) => c.id === conversationId);
                if (idx !== -1) {
                  draft[idx] = conversation;
                }
              }
            )
          );
        } catch {
          // Non-critical: the list item simply won't be refreshed
        }
      },
    }),
    /**
     * Loads the 30 messages preceding the given cursor (infinite scroll
     * towards the top) and appends them to the end of the cached
     * `getSelectedConversation` messages array (which is newest-first).
     */
    loadOlderMessages: builder.mutation<
      Message[],
      { conversationId: string; before: string }
    >({
      queryFn: async ({ conversationId, before }) => {
        try {
          const { data } = await Api.getConversationById(conversationId, {
            before,
          });
          return { data: data.messages };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (
        { conversationId },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: olderMessages } = await queryFulfilled;
          dispatch(
            messagingApi.util.updateQueryData(
              'getSelectedConversation',
              conversationId,
              (draft) => {
                const existingIds = new Set(draft.messages.map((m) => m.id));
                draft.messages.push(
                  ...olderMessages.filter((m) => !existingIds.has(m.id))
                );
              }
            )
          );
        } catch {
          // Non-critical: the user can retry by scrolling up again
        }
      },
    }),
    /**
     * Delta polling: fetches only the messages posted after the given
     * cursor (unbounded) and prepends them to the cached
     * `getSelectedConversation` messages array, instead of the old
     * behavior of reloading the whole conversation on every tick.
     */
    pollConversationMessages: builder.mutation<
      Message[],
      { conversationId: string; after: string }
    >({
      queryFn: async ({ conversationId, after }) => {
        try {
          const { data } = await Api.getConversationById(conversationId, {
            after,
          });
          return { data: data.messages };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (
        { conversationId },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: newMessages } = await queryFulfilled;
          if (newMessages.length === 0) {
            return;
          }
          dispatch(
            messagingApi.util.updateQueryData(
              'getSelectedConversation',
              conversationId,
              (draft) => {
                const existingIds = new Set(draft.messages.map((m) => m.id));
                draft.messages.unshift(
                  ...newMessages.filter((m) => !existingIds.has(m.id))
                );
              }
            )
          );
          dispatch(
            messagingApi.endpoints.markConversationSeen.initiate(conversationId)
          );
        } catch {
          // Non-critical: the next poll tick will retry
        }
      },
    }),
    /** Explicit read receipt, decoupled from simply loading messages. */
    markConversationSeen: builder.mutation<void, string>({
      queryFn: async (conversationId) => {
        try {
          await Api.markConversationSeen(conversationId);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
    }),
    /** Translates `postMessageSagaRequested`. */
    postMessage: builder.mutation<
      { message: MessageWithConversation; isNewConversation: boolean },
      FormData
    >({
      queryFn: async (formData) => {
        try {
          const { data } = await Api.postMessage(formData);
          return {
            data: {
              message: data,
              isNewConversation: !formData.get('conversationId'),
            },
          };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (formData, { dispatch, queryFulfilled }) => {
        try {
          const { data: result } = await queryFulfilled;
          const { message, isNewConversation } = result;

          if (isNewConversation) {
            // Always select the newly created conversation, even if
            // `getConversations` hasn't loaded yet (e.g. sending from the
            // wizard, which never mounts the messaging page beforehand).
            dispatch(selectConversation(message.conversation.id));
            dispatch(
              messagingApi.util.upsertQueryData(
                'getSelectedConversation',
                message.conversation.id,
                { ...message.conversation, messages: [message] } as Conversation
              )
            );
            dispatch(
              messagingApi.util.updateQueryData(
                'getConversations',
                undefined,
                (draft) => {
                  draft.unshift({
                    ...message.conversation,
                    messages: [message],
                  } as Conversation);
                }
              )
            );
          } else {
            const conversationId = message.conversation.id;
            dispatch(
              messagingApi.util.updateQueryData(
                'getSelectedConversation',
                conversationId,
                (draft) => {
                  draft.messages.unshift(message);
                }
              )
            );
            dispatch(
              messagingApi.util.updateQueryData(
                'getConversations',
                undefined,
                (draft) => {
                  const idx = draft.findIndex((c) => c.id === conversationId);
                  if (idx === -1) {
                    return;
                  }
                  draft[idx].messages.unshift(message);
                  draft[idx].participants.forEach((participant) => {
                    if (participant.id === message.authorId) {
                      participant.conversationParticipant.seenAt =
                        message.createdAt;
                    }
                  });
                  const [conversation] = draft.splice(idx, 1);
                  draft.unshift(conversation);
                }
              )
            );
          }
        } catch (rejection) {
          // `queryFulfilled` rejects with `{ error, isUnhandledError, meta }`
          // — the value the `queryFn` returned as `error`, not that value
          // itself.
          const error = (rejection as { error: unknown }).error;
          if (isMessagingDailyConversationLimitReachedError(error)) {
            dispatch(
              notificationsActions.addNotification({
                type: 'danger',
                message: `Nous sommes désolés, vous avez déjà contacté le maximum de membres aujourd’hui. Laissez le temps aux membres de vous répondre ! Si besoin, vous pourrez en contacter plus à partir de demain !`,
              })
            );
          }
        }
      },
    }),
    /** Translates `bindNewConversationSagaRequested`. */
    bindNewConversation: builder.mutation<void, string>({
      queryFn: async (requiredConvUserId, { dispatch }) => {
        const { data: conversations } = await dispatch(
          messagingApi.endpoints.getConversations.initiate(undefined, {
            forceRefetch: true,
          })
        );

        if (!requiredConvUserId) {
          return { data: undefined };
        }

        const existing = findExistingDirectConversation(
          conversations,
          requiredConvUserId
        );

        if (existing) {
          dispatch(selectConversation(existing.id));
          return { data: undefined };
        }

        try {
          const { data: profile } =
            await Api.getPublicUserProfile(requiredConvUserId);
          const participant: ConversationParticipant = {
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            role: profile.role,
            userProfile: profile,
          } as ConversationParticipant;

          dispatch(selectConversation('new'));
          dispatch(
            messagingApi.util.upsertQueryData(
              'getSelectedConversation',
              'new',
              buildNewConversationStub([participant])
            )
          );

          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
    }),
    /** Translates `postFeedbackSagaRequested`. */
    postFeedback: builder.mutation<
      void,
      { conversationParticipantId: string; rating: number | null }
    >({
      queryFn: async (payload) => {
        try {
          await Api.postConversationFeedback(payload);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, getState, queryFulfilled }) => {
        try {
          await queryFulfilled;
          const selectedConversationId = (getState() as any).messaging
            .selectedConversationId;
          if (!selectedConversationId) {
            return;
          }
          dispatch(
            messagingApi.util.updateQueryData(
              'getSelectedConversation',
              selectedConversationId,
              (draft) => {
                draft.shouldGiveFeedback = false;
              }
            )
          );
        } catch {
          // Matches the pre-existing behavior of `postFeedbackFailed`: it
          // built a notification action but never dispatched it, so no
          // notification was ever actually shown on failure.
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetUnseenConversationsCountQuery,
  useGetSelectedConversationQuery,
  useLoadOlderMessagesMutation,
  usePollConversationMessagesMutation,
  useMarkConversationSeenMutation,
  usePostMessageMutation,
  useBindNewConversationMutation,
  usePostFeedbackMutation,
} = messagingApi;
