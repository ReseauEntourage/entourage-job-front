import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { AchievementProgressionEntry } from '@/src/api/types';
import { openModal } from '@/src/features/modals/Modal/openModal';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { gamificationActions } from '@/src/use-cases/gamification';
import { useAchievementProgressionModal } from './useAchievementProgressionModal';

jest.mock('@/src/features/modals/Modal/openModal', () => ({
  openModal: jest.fn(),
}));
jest.mock(
  '@/src/features/modals/AchievementProgressionModal/AchievementProgressionModal',
  () => ({ AchievementProgressionModal: () => null })
);

const mockOpenModal = openModal as jest.Mock;

const entry = (
  hasAchievement: boolean,
  currentValue: number
): AchievementProgressionEntry =>
  ({
    type: 'badge-1',
    hasAchievement,
    criteria: [{ key: 'messages', currentValue }],
  }) as unknown as AchievementProgressionEntry;

function setup() {
  const store = createTestStore();
  renderHook(() => useAchievementProgressionModal(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });
  return store;
}

describe('useAchievementProgressionModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('opens nothing while there is no progression to show', () => {
    const store = setup();
    act(() => {
      store.dispatch(
        gamificationActions.achievementProgressionsInitialized([
          entry(false, 1),
        ])
      );
    });
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('opens the modal for a progression, then dismisses it from the store', () => {
    const store = setup();
    act(() => {
      store.dispatch(
        gamificationActions.achievementProgressionsInitialized([
          entry(false, 1),
        ])
      );
    });
    const next = entry(false, 2);

    act(() => {
      store.dispatch(
        gamificationActions.achievementProgressionReceived([next])
      );
    });

    expect(mockOpenModal).toHaveBeenCalledTimes(1);
    const element = mockOpenModal.mock.calls[0][0] as ReactElement<
      Record<string, unknown>
    >;
    expect(element.props).toEqual({
      entry: next,
      changedCriterionKey: 'messages',
    });
    expect(
      store.getState().gamification.achievementProgressionToShow
    ).toBeNull();
  });

  it('passes a null criterion key when the badge was just obtained', () => {
    const store = setup();
    act(() => {
      store.dispatch(
        gamificationActions.achievementProgressionsInitialized([
          entry(false, 1),
        ])
      );
    });

    act(() => {
      store.dispatch(
        gamificationActions.achievementProgressionReceived([entry(true, 5)])
      );
    });

    const element = mockOpenModal.mock.calls[0][0] as ReactElement<
      Record<string, unknown>
    >;
    expect(element.props.changedCriterionKey).toBeNull();
  });
});
