jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { currentUserActions } from '@/src/use-cases/current-user';
import { slice } from './profile-completion.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

/**
 * `refreshProfileCompletionSaga` waits ~300ms (a raw `setTimeout` promise,
 * not a `call` effect) before re-fetching the completion rate, so behavioral
 * tests exercising it must wait past that real delay before asserting.
 */
function waitForRefreshDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 320);
  });
}

describe('profile-completion saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchProfileCompletionRequested', () => {
    it('fetches the completion rate and dispatches fetchProfileCompletionSucceeded', async () => {
      const store = createTestStore();
      mockedApi.getProfileCompletion.mockResolvedValue({ data: 55 } as any);

      store.dispatch(actions.fetchProfileCompletionRequested());
      await flushPromises();

      expect(store.getState().profileCompletion.completionRate).toBe(55);
      expect(
        store.getState().profileCompletion.fetchProfileCompletion.status
      ).toBe('SUCCEEDED');
    });

    it('falls back to a completion rate of 0 when the API returns no data', async () => {
      const store = createTestStore();
      mockedApi.getProfileCompletion.mockResolvedValue({
        data: undefined,
      } as any);

      store.dispatch(actions.fetchProfileCompletionRequested());
      await flushPromises();

      expect(store.getState().profileCompletion.completionRate).toBe(0);
    });

    it('dispatches fetchProfileCompletionFailed and preserves the previous rate when the API call rejects', async () => {
      const store = createTestStore({
        profileCompletion: {
          ...slice.getInitialState(),
          completionRate: 40,
        },
      });
      mockedApi.getProfileCompletion.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchProfileCompletionRequested());
      await flushPromises();

      expect(
        store.getState().profileCompletion.fetchProfileCompletion.status
      ).toBe('FAILED');
      expect(store.getState().profileCompletion.completionRate).toBe(40);
    });
  });

  describe('refreshProfileCompletionSaga (cross-domain triggers)', () => {
    const scenarios: {
      name: string;
      trigger: () => { type: string; payload: unknown };
    }[] = [
      {
        name: 'updateProfileSucceeded',
        trigger: () =>
          currentUserActions.updateProfileSucceeded({ userProfile: {} as any }),
      },
      {
        name: 'updateUserProfilePictureSucceeded',
        trigger: () => currentUserActions.updateUserProfilePictureSucceeded(),
      },
      {
        name: 'uploadExternalCvSucceeded',
        trigger: () => currentUserActions.uploadExternalCvSucceeded(),
      },
      {
        name: 'deleteExternalCvSucceeded',
        trigger: () => currentUserActions.deleteExternalCvSucceeded(),
      },
    ];

    scenarios.forEach(({ name, trigger }) => {
      it(`re-fetches the completion rate after ${name} (past the debounce delay)`, async () => {
        const store = createTestStore();
        mockedApi.getProfileCompletion.mockResolvedValue({ data: 90 } as any);

        store.dispatch(trigger());
        await waitForRefreshDelay();
        await flushPromises();

        expect(mockedApi.getProfileCompletion).toHaveBeenCalled();
        expect(store.getState().profileCompletion.completionRate).toBe(90);
      });
    });

    it('does not re-fetch before the debounce delay has elapsed', async () => {
      const store = createTestStore();
      mockedApi.getProfileCompletion.mockResolvedValue({ data: 90 } as any);

      store.dispatch(
        currentUserActions.updateProfileSucceeded({ userProfile: {} as any })
      );
      await flushPromises();

      expect(mockedApi.getProfileCompletion).not.toHaveBeenCalled();
      expect(store.getState().profileCompletion.completionRate).toBe(0);
    });
  });
});
