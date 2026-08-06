// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ProfilesFilters, PublicProfile } from '@/src/api/types';
import { PROFILES_LIMIT } from '@/src/constants';
import { slice } from './profiles.slice';

const { actions, reducer } = slice;

const buildProfile = (overrides: Partial<PublicProfile> = {}) =>
  ({
    id: 'profile-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    ...overrides,
  }) as PublicProfile;

const buildFilters = (overrides: Partial<ProfilesFilters> = {}) =>
  ({
    role: 'coach',
    nudgeIds: [],
    departments: [],
    businessSectorIds: [],
    contactTypes: [],
    ...overrides,
  }) as ProfilesFilters;

describe('profiles slice', () => {
  describe('fetchProfilesSucceeded', () => {
    it('replaces the profiles list when offset is 0', () => {
      const initialState = {
        ...slice.getInitialState(),
        profilesOffset: 0,
        profiles: [buildProfile({ id: 'stale' })],
      };
      const profiles = [buildProfile({ id: 'profile-1' })];

      const state = reducer(
        initialState,
        actions.fetchProfilesSucceeded(profiles)
      );

      expect(state.profiles).toEqual(profiles);
    });

    it('appends to the profiles list when offset is greater than 0', () => {
      const existing = [buildProfile({ id: 'profile-1' })];
      const initialState = {
        ...slice.getInitialState(),
        profilesOffset: PROFILES_LIMIT,
        profiles: existing,
      };
      const nextPage = [buildProfile({ id: 'profile-2' })];

      const state = reducer(
        initialState,
        actions.fetchProfilesSucceeded(nextPage)
      );

      expect(state.profiles).toEqual([...existing, ...nextPage]);
    });

    it('marks profilesHasFetchedAll true when the page is smaller than the limit', () => {
      const state = reducer(
        undefined,
        actions.fetchProfilesSucceeded([buildProfile()])
      );

      expect(state.profilesHasFetchedAll).toBe(true);
    });

    it('marks profilesHasFetchedAll false when the page is full', () => {
      const fullPage = Array.from({ length: PROFILES_LIMIT }, (_, i) =>
        buildProfile({ id: `profile-${i}` })
      );

      const state = reducer(
        undefined,
        actions.fetchProfilesSucceeded(fullPage)
      );

      expect(state.profilesHasFetchedAll).toBe(false);
    });
  });

  describe('fetchDashboardProfilesRecommendationsSucceeded', () => {
    it('stores the recommendations and the embedding pending flag', () => {
      const recommendations = [
        { id: 'rec-1', publicProfile: buildProfile(), reason: 'needs' },
      ] as any;

      const state = reducer(
        undefined,
        actions.fetchDashboardProfilesRecommendationsSucceeded({
          recommendations,
          embeddingPending: true,
          nextCursor: null,
        })
      );

      expect(state.profilesRecommendations).toEqual(recommendations);
      expect(state.isEmbeddingPending).toBe(true);
    });
  });

  describe('fetchDashboardProfilesRecommendationsReset', () => {
    it('clears the recommendations list and the embedding pending flag', () => {
      const initialState = {
        ...slice.getInitialState(),
        profilesRecommendations: [{ id: 'rec-1' }] as any,
        isEmbeddingPending: true,
      };

      const state = reducer(
        initialState,
        actions.fetchDashboardProfilesRecommendationsReset()
      );

      expect(state.profilesRecommendations).toEqual([]);
      expect(state.isEmbeddingPending).toBe(false);
    });
  });

  it('fetchSelectedProfileSucceeded sets selectedProfile', () => {
    const profile = buildProfile();

    const state = reducer(
      undefined,
      actions.fetchSelectedProfileSucceeded(profile)
    );

    expect(state.selectedProfile).toEqual(profile);
  });

  it('embeddingPendingChanged sets isEmbeddingPending', () => {
    const state = reducer(undefined, actions.embeddingPendingChanged(true));

    expect(state.isEmbeddingPending).toBe(true);
  });

  it('resetProfilesOffset resets pagination state', () => {
    const initialState = {
      ...slice.getInitialState(),
      profilesOffset: PROFILES_LIMIT * 2,
      profilesHasFetchedAll: true,
      profiles: [buildProfile()],
    };

    const state = reducer(initialState, actions.resetProfilesOffset());

    expect(state.profilesOffset).toBe(0);
    expect(state.profilesHasFetchedAll).toBe(false);
    expect(state.profiles).toEqual([]);
  });

  it('fetchProfilesWithFilters does not mutate state', () => {
    const initialState = slice.getInitialState();

    const state = reducer(
      initialState,
      actions.fetchProfilesWithFilters(buildFilters())
    );

    expect(state).toEqual(initialState);
  });

  it('fetchProfilesNextPage does not mutate state (guard moved to profiles.listeners.ts)', () => {
    const initialState = slice.getInitialState();

    const state = reducer(
      initialState,
      actions.fetchProfilesNextPage(buildFilters())
    );

    expect(state).toEqual(initialState);
  });

  it('incrementProfilesOffset increments the offset by PROFILES_LIMIT', () => {
    const initialState = { ...slice.getInitialState(), profilesOffset: 0 };

    const state = reducer(initialState, actions.incrementProfilesOffset());

    expect(state.profilesOffset).toBe(PROFILES_LIMIT);
  });
});
