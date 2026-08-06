// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { PublicProfile } from '@/src/api/types';
import {
  selectIsEmbeddingPending,
  selectProfiles,
  selectProfilesHasFetchedAll,
  selectProfilesOffset,
  selectProfilesRecommendations,
  selectSelectedProfile,
} from './profiles.selectors';
import { slice } from './profiles.slice';

const buildProfile = (overrides: Partial<PublicProfile> = {}) =>
  ({
    id: 'profile-1',
    firstName: 'Jean',
    lastName: 'Dupont',
    ...overrides,
  }) as PublicProfile;

// `as any`: these selectors only read `state.profiles.*`, but the module's
// exported `RootState` type also requires the shared `api` reducer key (for
// the RTK-Query-backed status selectors in the same file) — not relevant here.
const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): any => ({
  profiles: { ...slice.getInitialState(), ...overrides },
});

describe('profiles.selectors', () => {
  it('selectProfiles returns the profiles list', () => {
    const profiles = [buildProfile()];
    expect(selectProfiles(buildState({ profiles }))).toEqual(profiles);
  });

  it('selectProfilesRecommendations returns the recommendations list', () => {
    const profilesRecommendations = [
      { id: 'rec-1', publicProfile: buildProfile(), reason: 'needs' },
    ] as any;
    expect(
      selectProfilesRecommendations(buildState({ profilesRecommendations }))
    ).toEqual(profilesRecommendations);
  });

  it('selectProfilesOffset returns the current pagination offset', () => {
    expect(selectProfilesOffset(buildState({ profilesOffset: 25 }))).toBe(25);
  });

  it('selectProfilesHasFetchedAll returns the pagination flag', () => {
    expect(
      selectProfilesHasFetchedAll(buildState({ profilesHasFetchedAll: true }))
    ).toBe(true);
    expect(
      selectProfilesHasFetchedAll(buildState({ profilesHasFetchedAll: false }))
    ).toBe(false);
  });

  it('selectSelectedProfile returns the selected profile', () => {
    const selectedProfile = buildProfile();
    expect(selectSelectedProfile(buildState({ selectedProfile }))).toEqual(
      selectedProfile
    );
  });

  it('selectIsEmbeddingPending returns the embedding pending flag', () => {
    expect(
      selectIsEmbeddingPending(buildState({ isEmbeddingPending: true }))
    ).toBe(true);
    expect(
      selectIsEmbeddingPending(buildState({ isEmbeddingPending: false }))
    ).toBe(false);
  });
});
