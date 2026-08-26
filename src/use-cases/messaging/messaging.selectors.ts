import { createSelector } from '@reduxjs/toolkit';
import { ConversationType } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import { messagingApi, POST_MESSAGE_FIXED_CACHE_KEY } from './messaging.api';
import { RootState as MessagingSliceRootState } from './messaging.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `messagingApi.endpoints.*.select()` calls below), unlike the plain
// per-slice `RootState` — same reasoning as `store.ts`/`createTestStore.ts`.
type RootState = MessagingSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

type ReduxRequestStatus =
  (typeof ReduxRequestEvents)[keyof typeof ReduxRequestEvents];

/**
 * Maps an RTK Query result's status flags to the `ReduxRequestEvents` enum
 * this domain's consumers already compare against, so migrating the data
 * layer doesn't force every consumer to switch to `isLoading`/`isSuccess`.
 */
function toReduxRequestStatus(result: {
  isUninitialized: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}): ReduxRequestStatus {
  if (result.isSuccess) {
    return ReduxRequestEvents.SUCCEEDED;
  }
  if (result.isError) {
    return ReduxRequestEvents.FAILED;
  }
  if (result.isUninitialized) {
    return ReduxRequestEvents.IDLE;
  }
  return ReduxRequestEvents.REQUESTED;
}

export const selectNewMessage = (state: RootState) =>
  state.messaging.newMessage;

export const selectPostMessageStatus = (state: RootState) =>
  toReduxRequestStatus(
    messagingApi.endpoints.postMessage.select(POST_MESSAGE_FIXED_CACHE_KEY)(
      state
    )
  );

export const selectIsAIPanelOpen = (state: RootState) =>
  state.messaging.isAIPanelOpen;

export const selectActivePanelView = (state: RootState) =>
  state.messaging.activePanelView;

export const selectConversations = (state: RootState) =>
  messagingApi.endpoints.getConversations.select()(state).data ?? null;

export const selectGetConversationsStatus = (state: RootState) =>
  toReduxRequestStatus(messagingApi.endpoints.getConversations.select()(state));

export const selectSelectedConversationId = (state: RootState) =>
  state.messaging.selectedConversationId;

export const selectSelectedConversation = (state: RootState) => {
  const id = selectSelectedConversationId(state);
  if (!id) {
    return null;
  }
  return (
    messagingApi.endpoints.getSelectedConversation.select(id)(state).data ??
    null
  );
};

export const selectPinnedInfo = (state: RootState) =>
  state.messaging.pinnedInfo;

export const selectHasMessages = (state: RootState) => {
  const conversations = selectConversations(state);
  return (
    conversations === null ||
    conversations.length > 0 ||
    state.messaging.selectedConversationId !== null
  );
};

export const selectUnseenConversationCount = (state: RootState) =>
  messagingApi.endpoints.getUnseenConversationsCount.select()(state).data ?? 0;

export const selectConversationParticipantsAreDeleted = (state: RootState) => {
  const selectedConversation = selectSelectedConversation(state);
  if (!selectedConversation) {
    return false;
  }

  return selectedConversation.participants.some((participant) => {
    return participant.userProfile === null;
  });
};

const selectCurrentUserIdParam = (
  _state: RootState,
  currentUserId: string | null
): string | null => currentUserId;

const selectCurrentUserHasSentMessagesSelector = createSelector(
  [selectSelectedConversation, selectCurrentUserIdParam],
  (selectedConversation, currentUserId): boolean => {
    if (!selectedConversation || !currentUserId) {
      return false;
    }

    return selectedConversation.messages.some(
      (message) => message.authorId === currentUserId
    );
  }
);

export const selectCurrentUserHasSentMessages =
  (currentUserId: string | null) =>
  (state: RootState): boolean =>
    selectCurrentUserHasSentMessagesSelector(state, currentUserId);

const selectOtherParticipantHasNotRepliedSelector = createSelector(
  [selectSelectedConversation, selectCurrentUserIdParam],
  (selectedConversation, currentUserId): boolean => {
    if (!selectedConversation || !currentUserId) {
      return false;
    }
    if (selectedConversation.type !== ConversationType.DIRECT) {
      return false;
    }
    if (selectedConversation.messages.length === 0) {
      return false;
    }

    return selectedConversation.messages.every(
      (message) => message.authorId === currentUserId
    );
  }
);

export const selectOtherParticipantHasNotReplied =
  (currentUserId: string | null) =>
  (state: RootState): boolean =>
    selectOtherParticipantHasNotRepliedSelector(state, currentUserId);
