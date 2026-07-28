// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  AchievementProgressionEntry,
  AchievementType,
  CriterionStat,
} from '@/src/api/types';
import { slice } from './gamification.slice';

const { actions, reducer } = slice;

const buildCriterion = (
  overrides: Partial<CriterionStat> = {}
): CriterionStat => ({
  key: 'messages-sent',
  label: 'Messages envoyés',
  currentValue: 1,
  threshold: 10,
  ...overrides,
});

const buildEntry = (
  overrides: Partial<AchievementProgressionEntry> = {}
): AchievementProgressionEntry => ({
  type: AchievementType.SUPER_ENGAGED_COACH,
  label: 'Coach engagé',
  hasAchievement: false,
  achievedAt: null,
  expireAt: null,
  statsWindowMonths: 6,
  criteria: [buildCriterion()],
  ...overrides,
});

describe('gamification slice', () => {
  describe('achievementProgressionsInitialized', () => {
    it('stores the progressions as the baseline, marks initialized and does not queue a modal', () => {
      const entries = [buildEntry()];

      const state = reducer(
        undefined,
        actions.achievementProgressionsInitialized(entries)
      );

      expect(state.achievementProgressions).toEqual(entries);
      expect(state.isInitialized).toBe(true);
      expect(state.achievementProgressionToShow).toBeNull();
    });

    it('clears any previously queued modal', () => {
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressionToShow: {
          entry: buildEntry(),
          changedCriterionKey: null,
        },
      };

      const state = reducer(
        initialState,
        actions.achievementProgressionsInitialized([])
      );

      expect(state.achievementProgressionToShow).toBeNull();
    });
  });

  describe('achievementProgressionReceived', () => {
    it('sets achievementProgressionToShow (changedCriterionKey null) when a badge is newly obtained (Cas 1)', () => {
      const previousEntry = buildEntry({ hasAchievement: false });
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressions: [previousEntry],
      };
      const newEntry = buildEntry({ hasAchievement: true });

      const state = reducer(
        initialState,
        actions.achievementProgressionReceived([newEntry])
      );

      expect(state.achievementProgressionToShow).toEqual({
        entry: newEntry,
        changedCriterionKey: null,
      });
    });

    it('sets achievementProgressionToShow with the changed criterion key when a criterion value increased (Cas 2)', () => {
      const previousEntry = buildEntry({
        hasAchievement: false,
        criteria: [buildCriterion({ key: 'messages-sent', currentValue: 1 })],
      });
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressions: [previousEntry],
      };
      const newEntry = buildEntry({
        hasAchievement: false,
        criteria: [buildCriterion({ key: 'messages-sent', currentValue: 2 })],
      });

      const state = reducer(
        initialState,
        actions.achievementProgressionReceived([newEntry])
      );

      expect(state.achievementProgressionToShow).toEqual({
        entry: newEntry,
        changedCriterionKey: 'messages-sent',
      });
    });

    it('does not queue a modal when the badge is already obtained and no criterion increased', () => {
      const previousEntry = buildEntry({
        hasAchievement: true,
        criteria: [buildCriterion({ currentValue: 5 })],
      });
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressions: [previousEntry],
      };
      const newEntry = buildEntry({
        hasAchievement: true,
        criteria: [buildCriterion({ currentValue: 5 })],
      });

      const state = reducer(
        initialState,
        actions.achievementProgressionReceived([newEntry])
      );

      expect(state.achievementProgressionToShow).toBeNull();
    });

    it('does not queue a modal when no criterion value increased', () => {
      const previousEntry = buildEntry({
        criteria: [buildCriterion({ currentValue: 5 })],
      });
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressions: [previousEntry],
      };
      const newEntry = buildEntry({
        criteria: [buildCriterion({ currentValue: 5 })],
      });

      const state = reducer(
        initialState,
        actions.achievementProgressionReceived([newEntry])
      );

      expect(state.achievementProgressionToShow).toBeNull();
    });

    it('ignores entries with no matching previous entry (skips the comparison)', () => {
      const newEntry = buildEntry({ hasAchievement: true });

      const state = reducer(
        undefined,
        actions.achievementProgressionReceived([newEntry])
      );

      expect(state.achievementProgressionToShow).toBeNull();
    });

    it('stops at the first entry matching either case, in array order (does not scan ahead for a Cas 1 match)', () => {
      const previousEntries = [
        buildEntry({
          type: AchievementType.SUPER_ENGAGED_COACH,
          hasAchievement: false,
          criteria: [buildCriterion({ key: 'a', currentValue: 1 })],
        }),
      ];
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressions: previousEntries,
      };
      // Only one AchievementType currently exists, so both entries share the
      // same `type`; only the first one (by array order) can match a previous
      // entry via `.find`. This asserts the loop breaks on the first entry
      // whose own check succeeds, rather than continuing to look for a
      // "more important" Cas 1 match later in the array.
      const matchingCas2Entry = buildEntry({
        hasAchievement: false,
        criteria: [buildCriterion({ key: 'a', currentValue: 2 })],
      });

      const state = reducer(
        initialState,
        actions.achievementProgressionReceived([matchingCas2Entry])
      );

      expect(state.achievementProgressionToShow).toEqual({
        entry: matchingCas2Entry,
        changedCriterionKey: 'a',
      });
    });

    it('replaces achievementProgressions with the new payload and marks initialized', () => {
      const newEntries = [buildEntry()];

      const state = reducer(
        undefined,
        actions.achievementProgressionReceived(newEntries)
      );

      expect(state.achievementProgressions).toEqual(newEntries);
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('dismissAchievementProgressionModal', () => {
    it('clears the queued modal', () => {
      const initialState = {
        ...slice.getInitialState(),
        achievementProgressionToShow: {
          entry: buildEntry(),
          changedCriterionKey: null,
        },
      };

      const state = reducer(
        initialState,
        actions.dismissAchievementProgressionModal()
      );

      expect(state.achievementProgressionToShow).toBeNull();
    });
  });

  describe('fetchAchievementProgressionInitial', () => {
    it('is a no-op reducer', () => {
      const initialState = slice.getInitialState();

      const state = reducer(
        initialState,
        actions.fetchAchievementProgressionInitial()
      );

      expect(state).toEqual(initialState);
    });
  });
});
