jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { currentUserActions } from '@/src/use-cases/current-user';
import { profileCompletionApi } from './profile-completion.api';

const mockedApi = getMockedApi();

/**
 * The cross-domain listener waits ~300ms (RTK's `listenerApi.delay`, a real
 * timer) before re-fetching the completion rate, so behavioral tests
 * exercising it must wait past that real delay before asserting.
 */
function waitForRefreshDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 320);
  });
}

function selectCompletionRate(store: ReturnType<typeof createTestStore>) {
  return profileCompletionApi.endpoints.getProfileCompletion.select(undefined)(
    store.getState()
  ).data;
}

describe('profile-completion api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('getProfileCompletion', () => {
    it('fetches and caches the completion rate', async () => {
      const store = createTestStore();
      mockedApi.getProfileCompletion.mockResolvedValue({ data: 55 } as any);

      await store.dispatch(
        profileCompletionApi.endpoints.getProfileCompletion.initiate()
      );

      expect(selectCompletionRate(store)).toBe(55);
    });

    it('falls back to a completion rate of 0 when the API returns no data', async () => {
      const store = createTestStore();
      mockedApi.getProfileCompletion.mockResolvedValue({
        data: undefined,
      } as any);

      await store.dispatch(
        profileCompletionApi.endpoints.getProfileCompletion.initiate()
      );

      expect(selectCompletionRate(store)).toBe(0);
    });

    it('surfaces an error and keeps no cached rate when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getProfileCompletion.mockRejectedValue(new Error('boom'));

      await store.dispatch(
        profileCompletionApi.endpoints.getProfileCompletion.initiate()
      );

      const result = profileCompletionApi.endpoints.getProfileCompletion.select(
        undefined
      )(store.getState());
      expect(result.status).toBe('rejected');
      expect(result.data).toBeUndefined();
    });
  });

  describe('cross-domain refresh listener', () => {
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
        expect(selectCompletionRate(store)).toBe(90);
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
      expect(selectCompletionRate(store)).toBeUndefined();
    });
  });
});
