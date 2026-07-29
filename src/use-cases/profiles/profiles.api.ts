import { Api } from '@/src/api';
import {
  Profile,
  ProfileRecommendationPage,
  ProfilesFilters,
} from '@/src/api/types';
import {
  DASHBOARD_RECOMMENDATIONS_LIMIT,
  PROFILES_LIMIT,
} from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import { mutateToArray } from '@/src/utils';
import { slice } from './profiles.slice';

const {
  fetchProfilesSucceeded,
  fetchDashboardProfilesRecommendationsSucceeded,
  fetchSelectedProfileSucceeded,
} = slice.actions;

/**
 * These three fixed cache keys replace the old per-domain single-status
 * `createRequestAdapter` fields: like the old status, each represents one
 * global "current fetch" rather than an RTK-Query-cached-per-argument
 * result (profiles/recommendations/selected-profile are never fetched
 * concurrently for different arguments in this domain).
 */
export const FETCH_PROFILES_FIXED_CACHE_KEY = 'fetchProfiles';
export const FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY =
  'fetchDashboardProfilesRecommendations';
export const FETCH_SELECTED_PROFILE_FIXED_CACHE_KEY = 'fetchSelectedProfile';

export const profilesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `fetchProfilesRequestedSaga`. */
    fetchProfiles: builder.mutation<
      Profile[],
      ProfilesFilters & { offset: number }
    >({
      queryFn: async ({
        departments,
        role,
        search,
        nudgeIds,
        businessSectorIds,
        contactTypes,
        isAvailable,
        sort,
        hasSuperCoachBadge,
        offset,
      }) => {
        try {
          const { data } = await Api.getAllUsersProfiles({
            departments: mutateToArray(departments),
            businessSectorIds: mutateToArray(businessSectorIds),
            nudgeIds: mutateToArray(nudgeIds),
            contactTypes: mutateToArray(contactTypes),
            role,
            search,
            offset,
            limit: PROFILES_LIMIT,
            isAvailable,
            sort,
            hasSuperCoachBadge,
          });
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(fetchProfilesSucceeded(data));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchDashboardProfilesRecommendationsRequestedSaga`. */
    fetchDashboardProfilesRecommendations: builder.mutation<
      ProfileRecommendationPage,
      void
    >({
      queryFn: async () => {
        try {
          const { data } = await Api.getProfilesRecommendations({
            limit: DASHBOARD_RECOMMENDATIONS_LIMIT,
          });
          return { data };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            fetchDashboardProfilesRecommendationsSucceeded(
              data.embeddingPending
                ? {
                    embeddingPending: true,
                    recommendations: [],
                    nextCursor: null,
                  }
                : data
            )
          );
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
    /** Translates `fetchSelectedProfileSaga`. */
    fetchSelectedProfile: builder.mutation<Profile, { userId: string }>({
      queryFn: async ({ userId }) => {
        try {
          const { data: profile } = await Api.getPublicUserProfile(userId);
          return { data: profile };
        } catch (error) {
          return { error };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: profile } = await queryFulfilled;
          dispatch(fetchSelectedProfileSucceeded({ ...profile }));
        } catch {
          // Handled by the mutation's own error state; no data change needed.
        }
      },
    }),
  }),
});

export const {
  useFetchProfilesMutation,
  useFetchDashboardProfilesRecommendationsMutation,
  useFetchSelectedProfileMutation,
} = profilesApi;
