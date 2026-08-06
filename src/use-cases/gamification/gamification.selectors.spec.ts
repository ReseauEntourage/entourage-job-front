// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { AchievementProgressionEntry, AchievementType } from '@/src/api/types';
import {
  selectAchievementProgressionToShow,
  selectAchievementProgressions,
  selectGamificationIsInitialized,
} from './gamification.selectors';
import { RootState, slice } from './gamification.slice';

const buildEntry = (
  overrides: Partial<AchievementProgressionEntry> = {}
): AchievementProgressionEntry => ({
  type: AchievementType.SUPER_ENGAGED_COACH,
  label: 'Coach engagé',
  hasAchievement: false,
  achievedAt: null,
  expireAt: null,
  statsWindowMonths: 6,
  criteria: [],
  ...overrides,
});

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    gamification: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

describe('gamification.selectors', () => {
  describe('selectAchievementProgressionToShow', () => {
    it('returns the queued progression to show', () => {
      const achievementProgressionToShow = {
        entry: buildEntry(),
        changedCriterionKey: 'messages-sent',
      };

      expect(
        selectAchievementProgressionToShow(
          buildState({ achievementProgressionToShow })
        )
      ).toEqual(achievementProgressionToShow);
    });

    it('returns null when there is nothing queued', () => {
      expect(selectAchievementProgressionToShow(buildState())).toBeNull();
    });
  });

  describe('selectAchievementProgressions', () => {
    it('returns the stored achievement progressions', () => {
      const achievementProgressions = [buildEntry()];

      expect(
        selectAchievementProgressions(buildState({ achievementProgressions }))
      ).toEqual(achievementProgressions);
    });

    it('returns an empty array by default', () => {
      expect(selectAchievementProgressions(buildState())).toEqual([]);
    });
  });

  describe('selectGamificationIsInitialized', () => {
    it('returns the isInitialized flag', () => {
      expect(
        selectGamificationIsInitialized(buildState({ isInitialized: true }))
      ).toBe(true);
      expect(
        selectGamificationIsInitialized(buildState({ isInitialized: false }))
      ).toBe(false);
    });
  });
});
