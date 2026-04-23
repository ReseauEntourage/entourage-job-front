import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AchievementProgressionEntry } from 'src/api/types';
import { SliceRootState } from 'src/store/utils';

interface AchievementProgressionToShow {
  entry: AchievementProgressionEntry;
  /**
   * Key of the criterion whose value increased since the last check.
   * `null` when the badge itself was just obtained (Cas 1 — prioritaire).
   */
  changedCriterionKey: string | null;
}

interface State {
  achievementProgressions: AchievementProgressionEntry[];
  achievementProgressionToShow: AchievementProgressionToShow | null;
  isInitialized: boolean;
}

const initialState: State = {
  achievementProgressions: [],
  achievementProgressionToShow: null,
  isInitialized: false,
};

export const slice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    /**
     * Stores the initial achievement progressions without triggering a modal.
     * Dispatched on app/layout mount to establish a baseline for future comparisons.
     */
    achievementProgressionsInitialized(
      state,
      action: PayloadAction<AchievementProgressionEntry[]>
    ) {
      state.achievementProgressions = action.payload;
      state.achievementProgressionToShow = null;
      state.isInitialized = true;
    },

    /**
     * Updates progressions after a triggering action (e.g. message sent).
     * Sets `achievementProgressionToShow` to the first entry where at least one
     * criterion value increased compared to the previously stored state, or where
     * `hasAchievement` became true for the first time.
     */
    achievementProgressionReceived(
      state,
      action: PayloadAction<AchievementProgressionEntry[]>
    ) {
      const newProgressions = action.payload;

      let progressionToShow: AchievementProgressionToShow | null = null;

      for (const newEntry of newProgressions) {
        const prev = state.achievementProgressions.find(
          (p) => p.type === newEntry.type
        );
        if (!prev) {
          continue;
        }

        // Cas 1 (prioritaire) — badge just obtained
        if (newEntry.hasAchievement && !prev.hasAchievement) {
          progressionToShow = { entry: newEntry, changedCriterionKey: null };
          break;
        }

        // Cas 2 — a specific criterion value increased
        const changedCriterion = newEntry.criteria.find((newCrit) => {
          const prevCrit = prev.criteria.find((c) => c.key === newCrit.key);
          return (
            prevCrit !== undefined &&
            newCrit.currentValue > prevCrit.currentValue
          );
        });

        if (changedCriterion) {
          progressionToShow = {
            entry: newEntry,
            changedCriterionKey: changedCriterion.key,
          };
          break;
        }
      }

      state.achievementProgressions = newProgressions;
      state.achievementProgressionToShow = progressionToShow;
      state.isInitialized = true;
    },

    /** Clears the queued modal after it has been displayed. */
    dismissAchievementProgressionModal(state) {
      state.achievementProgressionToShow = null;
    },

    /**
     * Triggers an initial fetch of achievement progressions (no-op reducer).
     * Dispatched from a global layout on mount so that a baseline is established
     * before the user sends any message, enabling comparison on the first action.
     */
    fetchAchievementProgressionInitial() {},
  },
});

export type RootState = SliceRootState<typeof slice>;
