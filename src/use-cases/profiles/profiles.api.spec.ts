jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ProfilesFilters } from '@/src/api/types';
import { PROFILES_LIMIT } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { FETCH_PROFILES_FIXED_CACHE_KEY, profilesApi } from './profiles.api';
import { slice } from './profiles.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

const buildFilters = (overrides: Partial<ProfilesFilters> = {}) =>
  ({
    role: 'coach',
    nudgeIds: [],
    departments: [],
    businessSectorIds: [],
    contactTypes: [],
    ...overrides,
  }) as ProfilesFilters;

function selectFetchProfilesResult(store: ReturnType<typeof createTestStore>) {
  return profilesApi.endpoints.fetchProfiles.select(
    FETCH_PROFILES_FIXED_CACHE_KEY
  )(store.getState());
}

describe('profiles api', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchProfilesRequested (trigger listener)', () => {
    it('stores the returned profiles on success', async () => {
      const store = createTestStore();
      const profiles = [{ id: 'profile-1' }] as any;
      mockedApi.getAllUsersProfiles.mockResolvedValue({
        data: profiles,
      } as any);

      store.dispatch(actions.fetchProfilesRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().profiles.profiles).toEqual(profiles);
      expect(selectFetchProfilesResult(store).isSuccess).toBe(true);
    });

    it('surfaces the error when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllUsersProfiles.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchProfilesRequested(buildFilters()));
      await flushPromises();

      expect(selectFetchProfilesResult(store).isError).toBe(true);
    });
  });

  describe('fetchProfilesWithFilters', () => {
    it('resets pagination and fetches profiles with the given filters', async () => {
      const store = createTestStore({
        profiles: {
          ...slice.getInitialState(),
          profilesOffset: 50,
          profilesHasFetchedAll: true,
        },
      });
      const profiles = [{ id: 'profile-1' }] as any;
      mockedApi.getAllUsersProfiles.mockResolvedValue({
        data: profiles,
      } as any);

      store.dispatch(
        actions.fetchProfilesWithFilters(buildFilters({ search: 'jean' }))
      );
      await flushPromises();

      expect(store.getState().profiles.profilesOffset).toBe(0);
      expect(store.getState().profiles.profiles).toEqual(profiles);
      expect(mockedApi.getAllUsersProfiles).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'jean', offset: 0 })
      );
    });
  });

  describe('fetchProfilesNextPage', () => {
    it('fetches the next page when the previous page succeeded', async () => {
      const store = createTestStore({
        profiles: {
          ...slice.getInitialState(),
          profilesHasFetchedAll: false,
        },
      });
      // A full page (not empty): an empty/partial page would itself flip
      // `profilesHasFetchedAll` to true via `fetchProfilesSucceeded`.
      const fullPage = Array.from({ length: PROFILES_LIMIT }, (_, i) => ({
        id: `profile-${i}`,
      })) as any;
      mockedApi.getAllUsersProfiles.mockResolvedValue({
        data: fullPage,
      } as any);
      // Seed a prior successful fetch — the guard requires the *last*
      // fetch to have succeeded, not just "not currently loading".
      await store.dispatch(
        profilesApi.endpoints.fetchProfiles.initiate(
          { ...buildFilters(), offset: 0 },
          { fixedCacheKey: FETCH_PROFILES_FIXED_CACHE_KEY }
        )
      );
      mockedApi.getAllUsersProfiles.mockClear();

      store.dispatch(actions.fetchProfilesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllUsersProfiles).toHaveBeenCalled();
      expect(store.getState().profiles.profilesOffset).toBeGreaterThan(0);
    });

    it('does nothing when all profiles have already been fetched', async () => {
      const store = createTestStore({
        profiles: {
          ...slice.getInitialState(),
          profilesHasFetchedAll: true,
        },
      });

      store.dispatch(actions.fetchProfilesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllUsersProfiles).not.toHaveBeenCalled();
    });

    it('does nothing when no fetch has ever succeeded yet (still idle)', async () => {
      const store = createTestStore({
        profiles: {
          ...slice.getInitialState(),
          profilesHasFetchedAll: false,
        },
      });

      store.dispatch(actions.fetchProfilesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllUsersProfiles).not.toHaveBeenCalled();
    });
  });

  describe('fetchDashboardProfilesRecommendationsRequested', () => {
    it('stores the recommendations on success when embedding is not pending', async () => {
      const store = createTestStore();
      const recommendations = [
        { id: 'rec-1', publicProfile: { id: 'profile-1' }, reason: 'needs' },
      ] as any;
      mockedApi.getProfilesRecommendations.mockResolvedValue({
        data: { embeddingPending: false, recommendations, nextCursor: null },
      } as any);

      store.dispatch(actions.fetchDashboardProfilesRecommendationsRequested());
      await flushPromises();

      expect(store.getState().profiles.profilesRecommendations).toEqual(
        recommendations
      );
      expect(store.getState().profiles.isEmbeddingPending).toBe(false);
    });

    it('forces an empty recommendations list when embedding is pending, ignoring any returned recommendations', async () => {
      const store = createTestStore();
      mockedApi.getProfilesRecommendations.mockResolvedValue({
        data: {
          embeddingPending: true,
          recommendations: [{ id: 'rec-1' }],
          nextCursor: 5,
        },
      } as any);

      store.dispatch(actions.fetchDashboardProfilesRecommendationsRequested());
      await flushPromises();

      expect(store.getState().profiles.profilesRecommendations).toEqual([]);
      expect(store.getState().profiles.isEmbeddingPending).toBe(true);
    });
  });

  describe('fetchSelectedProfileRequested', () => {
    it('stores the selected profile on success', async () => {
      const store = createTestStore();
      const profile = { id: 'profile-1', firstName: 'Jean' } as any;
      mockedApi.getPublicUserProfile.mockResolvedValue({
        data: profile,
      } as any);

      store.dispatch(
        actions.fetchSelectedProfileRequested({ userId: 'profile-1' })
      );
      await flushPromises();

      expect(store.getState().profiles.selectedProfile).toEqual(profile);
      expect(mockedApi.getPublicUserProfile).toHaveBeenCalledWith('profile-1');
    });
  });
});
