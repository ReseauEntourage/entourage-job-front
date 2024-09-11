import { createSlice } from '@reduxjs/toolkit';
import { Conversation } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  getSelectedConversationAdapter,
  getConversationsAdapter,
  postMessageAdapter,
} from './messaging.adapter';

export type MessagingPinnedInfo = 'ADDRESSEE_UNAVAILABLE' | null;

export interface State {
  getConversations: RequestState<typeof getConversationsAdapter>;
  getSelectedConversation: RequestState<typeof getSelectedConversationAdapter>;
  postMessage: RequestState<typeof postMessageAdapter>;
  conversations: Conversation[] | null;
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  pinnedInfo: MessagingPinnedInfo;
  query: string;
}

const initialState: State = {
  getConversations: getConversationsAdapter.getInitialState(),
  getSelectedConversation: getSelectedConversationAdapter.getInitialState(),
  postMessage: postMessageAdapter.getInitialState(),
  conversations: null,
  selectedConversationId: null,
  selectedConversation: null,
  pinnedInfo: null,
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
    ...postMessageAdapter.getReducers<State>((state) => state.postMessage, {
      postMessageSucceeded(state, action) {
        // Append the new message to the selected conversation
        state.selectedConversation?.messages.push(action.payload);

        if (state.conversations) {
          // Append the new message to the conversation list
          const idxSelectedConversation = state.conversations?.findIndex(
            (conversation) => conversation.id === state.selectedConversationId
          );
          state.conversations[idxSelectedConversation].messages.push(
            action.payload
          );

          // Set the conversation as seen
          state.conversations[idxSelectedConversation].participants.forEach(
            (participant) => {
              if (participant.id === action.payload.authorId) {
                participant.ConversationParticipant.seenAt =
                  action.payload.createdAt;
              }
            }
          );
        }
      },
    }),
    ...getSelectedConversationAdapter.getReducers<State>(
      (state) => state.getSelectedConversation,
      {
        getSelectedConversationSucceeded(state, action) {
          state.selectedConversation = action.payload;
          if (state.conversations) {
            const idxSelectedConversation = state.conversations?.findIndex(
              (conversation) => conversation.id === state.selectedConversationId
            );
            state.conversations[idxSelectedConversation] = action.payload;
          }
        },
      }
    ),
    selectConversation(state, action) {
      state.selectedConversationId = action.payload;
    },
    setQuery(state, action) {
      state.query = action.payload;
    },
    setPinnedInfo(state, action) {
      state.pinnedInfo = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
