import { Api } from '@/src/api';
import { api } from '@/src/store/api/api.slice';

/** Translates `fetchProfileCompletionSaga`. */
export const profileCompletionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfileCompletion: builder.query<number, void>({
      queryFn: async () => {
        try {
          const { data } = await Api.getProfileCompletion();
          return { data: data || 0 };
        } catch {
          return { error: 'FETCH_FAILED' as const };
        }
      },
    }),
  }),
});

export const { useGetProfileCompletionQuery } = profileCompletionApi;
