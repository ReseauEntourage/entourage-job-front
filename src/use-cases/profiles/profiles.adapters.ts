import {
  ProfilesFilters,
  Profile,
  ProfileRecommendationPage,
} from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchProfilesAdapter = createRequestAdapter(
  'fetchProfiles'
).withPayloads<ProfilesFilters, Profile[]>();

export const fetchDashboardProfilesRecommendationsAdapter =
  createRequestAdapter('fetchDashboardProfilesRecommendations').withPayloads<
    void,
    ProfileRecommendationPage
  >();

export const fetchSelectedProfileAdapter = createRequestAdapter(
  'fetchSelectedProfile'
).withPayloads<
  {
    userId: string;
  },
  Profile
>();
