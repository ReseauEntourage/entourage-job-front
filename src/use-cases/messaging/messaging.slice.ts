import { createSlice } from '@reduxjs/toolkit';
import { Conversation } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  getSelectedConversationAdapter,
  getConversationsAdapter,
  postMessageAdapter,
  getUnseenConversationsCountAdapter,
} from './messaging.adapter';

export type MessagingPinnedInfo = 'ADDRESSEE_UNAVAILABLE' | null;

export interface State {
  getConversations: RequestState<typeof getConversationsAdapter>;
  getUnseenConversationsCount: RequestState<
    typeof getUnseenConversationsCountAdapter
  >;
  getSelectedConversation: RequestState<typeof getSelectedConversationAdapter>;
  postMessage: RequestState<typeof postMessageAdapter>;
  conversations: Conversation[] | null;
  selectedConversationId: string | null;
  selectedConversation: Conversation | null;
  pinnedInfo: MessagingPinnedInfo;
  query: string;
  unseenConversationCount: number;
}

const initialState: State = {
  getConversations: getConversationsAdapter.getInitialState(),
  getUnseenConversationsCount:
    getUnseenConversationsCountAdapter.getInitialState(),
  getSelectedConversation: getSelectedConversationAdapter.getInitialState(),
  postMessage: postMessageAdapter.getInitialState(),
  conversations: null,
  selectedConversationId: null,
  selectedConversation: null,
  pinnedInfo: null,
  query: '',
  unseenConversationCount: 0,
};

export const slice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    ...getConversationsAdapter.getReducers<State>(
      (state) => state.getConversations,
      {
        getConversationsSucceeded(state, action) {
          // Only change the state if the conversations are different
          state.conversations = action.payload;
        },
      }
    ),
    ...getUnseenConversationsCountAdapter.getReducers<State>(
      (state) => state.getUnseenConversationsCount,
      {
        getUnseenConversationsCountSucceeded(state, action) {
          state.unseenConversationCount = action.payload;
        },
      }
    ),
    ...postMessageAdapter.getReducers<State>((state) => state.postMessage, {
      postMessageSucceeded(state, action) {
        const { message } = action.payload;
        const { isNewConversation } = action.payload;

        if (isNewConversation) {
          // Append the new conversation to the conversation list at the top
          if (state.conversations) {
            const newConversation = {
              ...message.conversation,
              messages: [message],
            };
            state.conversations.unshift(newConversation);
            state.selectedConversationId = message.conversation.id;
          }
        } else if (state.conversations) {
          // Append the new message to the conversation list
          const idxSelectedConversation = state.conversations?.findIndex(
            (conversation) => conversation.id === state.selectedConversationId
          );
          state.conversations[idxSelectedConversation].messages.push(message);
          state.selectedConversation?.messages.push(message);

          // Set the conversation as seen
          state.conversations[idxSelectedConversation].participants.forEach(
            (participant) => {
              if (participant.id === message.authorId) {
                participant.ConversationParticipant.seenAt = message.createdAt;
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
    selectConversationByParticipants(state, action) {
      // action.payload is an array of participants
      const conversation = state.conversations?.find(
        (conv) =>
          conv.participants.length === 2 && // Only 1-1 conversations
          conv.participants.find((p) => p.id === action.payload[0].id) // The required user is in the conversation
      );

      if (conversation) {
        state.selectedConversationId = conversation.id;
      } else {
        const newConversation: Conversation = {
          id: 'new',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
          participants: action.payload,
        };
        state.selectedConversationId = 'new';
        state.selectedConversation = newConversation;
      }
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
