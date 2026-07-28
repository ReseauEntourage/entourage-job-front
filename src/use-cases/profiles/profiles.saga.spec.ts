jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ProfilesFilters } from '@/src/api/types';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
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

describe('profiles saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchProfilesRequested', () => {
    it('stores the returned profiles on success', async () => {
      const store = createTestStore();
      const profiles = [{ id: 'profile-1' }] as any;
      mockedApi.getAllUsersProfiles.mockResolvedValue({
        data: profiles,
      } as any);

      store.dispatch(actions.fetchProfilesRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().profiles.profiles).toEqual(profiles);
      expect(store.getState().profiles.fetchProfiles.status).toBe('SUCCEEDED');
    });

    it('dispatches fetchProfilesFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getAllUsersProfiles.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchProfilesRequested(buildFilters()));
      await flushPromises();

      expect(store.getState().profiles.fetchProfiles.status).toBe('FAILED');
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
    it('fetches the next page when not all profiles were fetched and no fetch is in flight', async () => {
      const store = createTestStore({
        profiles: {
          ...slice.getInitialState(),
          profilesHasFetchedAll: false,
        },
      });
      mockedApi.getAllUsersProfiles.mockResolvedValue({ data: [] } as any);

      store.dispatch(actions.fetchProfilesNextPage(buildFilters()));
      await flushPromises();

      expect(mockedApi.getAllUsersProfiles).toHaveBeenCalled();
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

    it('does nothing when a fetch is already in flight', async () => {
      const store = createTestStore({
        profiles: {
          ...slice.getInitialState(),
          profilesHasFetchedAll: false,
          fetchProfiles: { status: 'REQUESTED' as any },
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
      expect(
        store.getState().profiles.fetchDashboardProfilesRecommendations.status
      ).toBe('SUCCEEDED');
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

    it('dispatches fetchDashboardProfilesRecommendationsFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getProfilesRecommendations.mockRejectedValue(new Error('boom'));

      store.dispatch(actions.fetchDashboardProfilesRecommendationsRequested());
      await flushPromises();

      expect(
        store.getState().profiles.fetchDashboardProfilesRecommendations.status
      ).toBe('FAILED');
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

    it('dispatches fetchSelectedProfileFailed when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.getPublicUserProfile.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.fetchSelectedProfileRequested({ userId: 'profile-1' })
      );
      await flushPromises();

      expect(store.getState().profiles.fetchSelectedProfile.status).toBe(
        'FAILED'
      );
    });
  });
});
