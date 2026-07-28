jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { AchievementProgressionEntry, AchievementType } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { slice as messagingSlice } from '@/src/use-cases/messaging/messaging.slice';
import { slice } from './gamification.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildEntry = (
  overrides: Partial<AchievementProgressionEntry> = {}
): AchievementProgressionEntry => ({
  type: AchievementType.SUPER_ENGAGED_COACH,
  label: 'Coach engagé',
  hasAchievement: false,
  achievedAt: null,
  expireAt: null,
  statsWindowMonths: 6,
  criteria: [
    {
      key: 'messages-sent',
      label: 'Messages envoyés',
      currentValue: 1,
      threshold: 10,
    },
  ],
  ...overrides,
});

describe('gamification saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchAchievementProgressionInitial', () => {
    it('fetches the progressions and stores them as the baseline without queuing a modal', async () => {
      const store = createTestStore();
      const entries = [buildEntry({ hasAchievement: true })];
      mockedApi.getAchievementProgression.mockResolvedValue({
        data: entries,
      } as any);

      store.dispatch(actions.fetchAchievementProgressionInitial());
      await flushPromises();

      expect(store.getState().gamification.achievementProgressions).toEqual(
        entries
      );
      expect(store.getState().gamification.isInitialized).toBe(true);
      expect(
        store.getState().gamification.achievementProgressionToShow
      ).toBeNull();
    });

    it('silently ignores API failures', async () => {
      const store = createTestStore();
      mockedApi.getAchievementProgression.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchAchievementProgressionInitial());
      await flushPromises();

      expect(store.getState().gamification.isInitialized).toBe(false);
      expect(store.getState().gamification.achievementProgressions).toEqual([]);
    });
  });

  describe('messaging postMessageSucceeded (cross-domain)', () => {
    function dispatchPostMessageSucceeded(
      store: ReturnType<typeof createTestStore>
    ) {
      store.dispatch(
        messagingSlice.actions.postMessageSucceeded({
          message: {
            id: 'message-1',
            authorId: 'user-1',
            createdAt: '2026-01-01T00:00:00.000Z',
            conversation: { id: 'conversation-1' },
          } as any,
          isNewConversation: true,
        })
      );
    }

    it('re-fetches progressions and queues a modal when a criterion increased since the baseline', async () => {
      const store = createTestStore();
      const baseline = [
        buildEntry({
          criteria: [
            {
              key: 'messages-sent',
              label: 'Messages envoyés',
              currentValue: 1,
              threshold: 10,
            },
          ],
        }),
      ];
      mockedApi.getAchievementProgression.mockResolvedValue({
        data: baseline,
      } as any);
      store.dispatch(actions.fetchAchievementProgressionInitial());
      await flushPromises();

      const updated = [
        buildEntry({
          criteria: [
            {
              key: 'messages-sent',
              label: 'Messages envoyés',
              currentValue: 2,
              threshold: 10,
            },
          ],
        }),
      ];
      mockedApi.getAchievementProgression.mockResolvedValue({
        data: updated,
      } as any);

      dispatchPostMessageSucceeded(store);
      await flushPromises();

      expect(store.getState().gamification.achievementProgressions).toEqual(
        updated
      );
      expect(
        store.getState().gamification.achievementProgressionToShow
      ).toEqual({
        entry: updated[0],
        changedCriterionKey: 'messages-sent',
      });
    });

    it('silently ignores API failures triggered after a message is sent', async () => {
      const store = createTestStore();
      mockedApi.getAchievementProgression.mockRejectedValue(new Error('boom'));

      dispatchPostMessageSucceeded(store);
      await flushPromises();

      expect(store.getState().gamification.achievementProgressions).toEqual([]);
      expect(
        store.getState().gamification.achievementProgressionToShow
      ).toBeNull();
    });
  });
});
