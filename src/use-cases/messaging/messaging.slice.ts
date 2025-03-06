import { createSlice } from '@reduxjs/toolkit';
import { Conversation } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  getSelectedConversationAdapter,
  getConversationsAdapter,
  postMessageAdapter,
  getUnseenConversationsCountAdapter,
  bindNewConversationAdapter,
} from './messaging.adapter';

export type MessagingPinnedInfo = 'ADDRESSEE_UNAVAILABLE' | null;

export interface State {
  getConversations: RequestState<typeof getConversationsAdapter>;
  getUnseenConversationsCount: RequestState<
    typeof getUnseenConversationsCountAdapter
  >;
  bindNewConversation: RequestState<typeof bindNewConversationAdapter>;
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
  bindNewConversation: bindNewConversationAdapter.getInitialState(),
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
    ...bindNewConversationAdapter.getReducers<State>(
      (state) => state.bindNewConversation,
      {
        bindNewConversationSucceeded(state, action) {
          const conversation = state.conversations?.find(
            (conv) =>
              conv.participants.length === 2 && // Only 1-1 conversations
              conv.participants.find((p) => p.id === action.payload[0].id) // The required user is in the conversation
          );

          if (conversation) {
            state.selectedConversationId = conversation.id;
          } else {
            const newConversation: Conversation = {
              id: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              messages: [],
              participants: action.payload,
            };
            state.selectedConversationId = 'new';
            state.selectedConversation = newConversation;
          }
        },
      }
    ),
    ...postMessageAdapter.getReducers<State>((state) => state.postMessage, {
      postMessageSucceeded(state, action) {
        const { message } = action.payload;
        const { isNewConversation } = action.payload;

        // console.log('messageSucceded');

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
          // console.log('here');
          // Append the new message to the conversation list
          const selectedConvIdx = state.conversations?.findIndex(
            (conversation) => conversation.id === state.selectedConversationId
          );
          // console.log(selectedConvIdx);
          state.conversations[selectedConvIdx].messages.push(message);
          state.selectedConversation?.messages.push(message);

          // console.log(state.conversations[selectedConvIdx].participants);

          // Set the conversation as seen

          // console.log('YOYO');
          // console.log(state.conversations[selectedConvIdx].participants);
          state.conversations[selectedConvIdx].participants.forEach(
            (participant) => {
              if (participant.id === message.authorId) {
                participant.conversationParticipant.seenAt = message.createdAt;
              }
            }
          );

          // Move the conversation to the first position
          const conversation = state.conversations[selectedConvIdx];
          state.conversations.splice(selectedConvIdx, 1);
          state.conversations.unshift(conversation);
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
