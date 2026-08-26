import { createSlice } from '@reduxjs/toolkit';
import { SliceRootState } from '@/src/store/utils';

type MessagingPinnedInfo = 'ADDRESSEE_UNAVAILABLE' | 'ADDRESSEE_DELETED' | null;

export type MessagingPanelView = 'ai';

interface State {
  selectedConversationId: string | null;
  pinnedInfo: MessagingPinnedInfo;
  query: string;
  newMessage: string;
  isAIPanelOpen: boolean;
  activePanelView: MessagingPanelView;
}

const initialState: State = {
  selectedConversationId: null,
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
    postFeedbackRequested(
      _state,
      _action: {
        payload: { conversationParticipantId: string; rating: number | null };
      }
    ) {},
    selectConversation(state, action: { payload: string | null }) {
      state.selectedConversationId = action.payload;
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
