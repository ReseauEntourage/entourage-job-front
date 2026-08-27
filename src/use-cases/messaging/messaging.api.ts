import { Api } from '@/src/api';
import { isMessagingDailyConversationLimitReachedError } from '@/src/api/axiosErrors';
import {
  Conversation,
  ConversationParticipant,
  ConversationParticipants,
  ConversationType,
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
    archiveConversation: builder.mutation<void, string>({
      queryFn: async (conversationId) => {
        try {
          await Api.archiveConversation(conversationId);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (conversationId, { dispatch, queryFulfilled }) => {
        const archivedAt = new Date().toISOString();
        const patches = [
          dispatch(
            messagingApi.util.updateQueryData(
              'getConversations',
              undefined,
              (draft) => {
                const conversation = draft.find((c) => c.id === conversationId);
                if (conversation) {
                  conversation.archivedAt = archivedAt;
                }
              }
            )
          ),
          dispatch(
            messagingApi.util.updateQueryData(
              'getSelectedConversation',
              conversationId,
              (draft) => {
                draft.archivedAt = archivedAt;
              }
            )
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    unarchiveConversation: builder.mutation<void, string>({
      queryFn: async (conversationId) => {
        try {
          await Api.unarchiveConversation(conversationId);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (conversationId, { dispatch, queryFulfilled }) => {
        const patches = [
          dispatch(
            messagingApi.util.updateQueryData(
              'getConversations',
              undefined,
              (draft) => {
                const conversation = draft.find((c) => c.id === conversationId);
                if (conversation) {
                  conversation.archivedAt = null;
                }
              }
            )
          ),
          dispatch(
            messagingApi.util.updateQueryData(
              'getSelectedConversation',
              conversationId,
              (draft) => {
                draft.archivedAt = null;
              }
            )
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
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
  }),
});

export const {
  useGetConversationsQuery,
  useGetUnseenConversationsCountQuery,
  useGetSelectedConversationQuery,
  usePostMessageMutation,
  useBindNewConversationMutation,
  useArchiveConversationMutation,
  useUnarchiveConversationMutation,
} = messagingApi;
