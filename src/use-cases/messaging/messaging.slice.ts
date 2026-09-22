import { createSlice } from '@reduxjs/toolkit';
import { ConversationParticipants } from '@/src/api/types';
import { SliceRootState } from '@/src/store/utils';
import { NEW_CONVERSATION_ID } from './messaging.utils';

type MessagingPinnedInfo = 'ADDRESSEE_UNAVAILABLE' | 'ADDRESSEE_DELETED' | null;

export type MessagingPanelView = 'ai';

interface State {
  selectedConversationId: string | null;
  /**
   * Addressee(s) of the conversation being composed, while it does not
   * exist server-side yet. Client-only state, deliberately kept here and
   * NOT in the RTK Query cache: a cache entry with no subscriber is
   * garbage-collected after `keepUnusedDataFor`, which is exactly what used
   * to make a slowly-written first message impossible to send. Its lifetime
   * is functional (bound to the selected conversation), never temporal.
   */
  newConversationDraft: ConversationParticipants | null;
  pinnedInfo: MessagingPinnedInfo;
  query: string;
  newMessage: string;
  isAIPanelOpen: boolean;
  activePanelView: MessagingPanelView;
}

const initialState: State = {
  selectedConversationId: null,
  newConversationDraft: null,
  pinnedInfo: null,
  query: '',
  newMessage: '',
  isAIPanelOpen: false,
  activePanelView: 'ai',
};

export const slice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    // No-op trigger actions: real handling lives in `messaging.api.ts`,
    // dispatched via `messaging.listeners.ts` in reaction to these.
    getConversationsRequested() {},
    getUnseenConversationsCountRequested() {},
    getSelectedConversationRequested() {},
    markConversationSeenRequested() {},
    postMessageRequested(_state, _action: { payload: FormData }) {},
    bindNewConversationRequested(_state, _action: { payload: string }) {},
    selectConversation(state, action: { payload: string | null }) {
      state.selectedConversationId = action.payload;
      // Leaving the "new conversation" screen — for an existing
      // conversation, the one just created, or nothing at all — discards
      // the draft, so a later compose never inherits a stale addressee.
      if (action.payload !== NEW_CONVERSATION_ID) {
        state.newConversationDraft = null;
      }
    },
    setNewConversationDraft(
      state,
      action: { payload: ConversationParticipants }
    ) {
      state.newConversationDraft = action.payload;
    },
    clearNewConversationDraft(state) {
      state.newConversationDraft = null;
    },
    setQuery(state, action: { payload: string }) {
      state.query = action.payload;
    },
    setPinnedInfo(state, action: { payload: MessagingPinnedInfo }) {
      state.pinnedInfo = action.payload;
    },
    setNewMessage(state, action: { payload: string }) {
      state.newMessage = action.payload;
    },
    setIsAIPanelOpen(state, action: { payload: boolean }) {
      state.isAIPanelOpen = action.payload;
    },
    setActivePanelView(state, action: { payload: MessagingPanelView }) {
      state.activePanelView = action.payload;
      state.isAIPanelOpen = true;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
