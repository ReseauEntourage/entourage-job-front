import { ProfilesFilters, Profile } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchProfilesAdapter = createRequestAdapter(
  'fetchProfiles'
).withPayloads<ProfilesFilters, Profile[]>();

export const fetchProfilesRecommendationsAdapter = createRequestAdapter(
  'fetchProfilesRecommendations'
).withPayloads<void, Profile[]>();

export const fetchSelectedProfileAdapter = createRequestAdapter(
  'fetchSelectedProfile'
).withPayloads<
  {
    userId: string;
  },
  Profile
>();
