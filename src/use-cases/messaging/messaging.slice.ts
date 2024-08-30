import { createSlice } from '@reduxjs/toolkit';
import { Conversation } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  getConversationByIdAdapter,
  getConversationsAdapter,
  postMessageAdapter,
} from './messaging.adapter';

export interface State {
  getConversations: RequestState<typeof getConversationsAdapter>;
  conversations: Conversation[];
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  query: string;
}

const initialState: State = {
  getConversations: getConversationsAdapter.getInitialState(),
  conversations: [],
  selectedConversationId: null,
  selectedConversation: null,
  query: '',
};

export const slice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    ...getConversationsAdapter.getReducers<State>(
      (state) => state.getConversations,
      {
        getConversationsSucceeded(state, action) {
          state.conversations = action.payload;
        },
      }
    ),
    ...postMessageAdapter.getReducers<State>(
      (state) => state.getConversations,
      {
        postMessageSucceeded(state, action) {
          state.selectedConversation?.messages.push(action.payload);
          state.conversations.forEach((conversation) => {
            if (conversation.id === state.selectedConversationId) {
              conversation.messages[0] = action.payload;
            }
          });
        },
      }
    ),
    ...getConversationByIdAdapter.getReducers<State>(
      (state) => state.getConversations,
      {
        getConversationByIdSucceeded(state, action) {
          state.selectedConversation = action.payload;
        },
      }
    ),
    selectConversation(state, action) {
      state.selectedConversationId = action.payload;
    },
    setQuery(state, action) {
      state.query = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
