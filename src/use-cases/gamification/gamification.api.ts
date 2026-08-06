import { Api } from '@/src/api';
import { AchievementProgressionEntry } from '@/src/api/types';
import { api } from '@/src/store/api/api.slice';
import { slice } from './gamification.slice';

const { achievementProgressionsInitialized, achievementProgressionReceived } =
  slice.actions;

async function fetchAchievementProgression() {
  try {
    const { data } = await Api.getAchievementProgression();
    return { data };
  } catch (error) {
    return { error };
  }
}

export const gamificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Translates `fetchInitialProgressionSaga`: establishes the baseline
     * progressions on mount, without triggering the "new achievement" modal.
     */
    getAchievementProgression: builder.query<
      AchievementProgressionEntry[],
      void
    >({
      queryFn: fetchAchievementProgression,
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(achievementProgressionsInitialized(data));
        } catch {
          // Non-critical: silently ignore failures so the UI is not affected
        }
      },
    }),
    /**
     * Translates `fetchProgressionAfterMessageSaga`: refetches progressions
     * after a message is sent, diffing against the baseline to decide
     * whether to show the "new achievement" modal. Triggered by
     * `gamification.listeners.ts` in reaction to messaging's
     * `postMessageSucceeded` action (see design.md Decision 8).
     */
    refetchAchievementProgressionAfterMessage: builder.query<
      AchievementProgressionEntry[],
      void
    >({
      queryFn: fetchAchievementProgression,
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(achievementProgressionReceived(data));
        } catch {
          // Non-critical: silently ignore failures so the UI is not affected
        }
      },
    }),
  }),
});

export const {
  useGetAchievementProgressionQuery,
  useRefetchAchievementProgressionAfterMessageQuery,
} = gamificationApi;
