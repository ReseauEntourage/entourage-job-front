import { Api } from '@/src/api';
import {
  CheckinState,
  ConversationCheckin,
  SubmitCheckinAnswerParams,
} from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';

export const checkinApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCheckin: builder.query<CheckinState, string>({
      queryFn: async (conversationId) => {
        try {
          const { data } = await Api.getCheckin(conversationId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    submitCheckinAnswer: builder.mutation<
      ConversationCheckin,
      { conversationId: string; answer: SubmitCheckinAnswerParams }
    >({
      queryFn: async ({ conversationId, answer }) => {
        try {
          const { data } = await Api.submitCheckinAnswer(
            conversationId,
            answer
          );
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    requestCheckinContact: builder.mutation<ConversationCheckin, string>({
      queryFn: async (conversationId) => {
        try {
          const { data } = await Api.postCheckinContactRequest(conversationId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
    sendCheckinNote: builder.mutation<
      ConversationCheckin,
      { conversationId: string; content: string }
    >({
      queryFn: async ({ conversationId, content }) => {
        try {
          const { data } = await Api.postCheckinNote(conversationId, content);
          return { data };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useGetCheckinQuery,
  useSubmitCheckinAnswerMutation,
  useRequestCheckinContactMutation,
  useSendCheckinNoteMutation,
} = checkinApi;
