import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsActions } from '@/src/use-cases/notifications';

import {
  fetchDashboardProfilesRecommendationsSelectors,
  fetchProfilesSelectors,
  FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY,
  profilesActions,
  selectIsEmbeddingPending,
  selectProfilesRecommendations,
  useFetchDashboardProfilesRecommendationsMutation,
} from '@/src/use-cases/profiles';

/**
 * @returns {Object} An object containing:
 *   - recommendations: The list of recommended profiles.
 *   - isLoading: Boolean indicating if data is being loaded.
 *   - isError: Boolean indicating if there was an error fetching data.
 */
export function useDashboardRecommendations() {
  const dispatch = useDispatch();

  const recommendations = useSelector(selectProfilesRecommendations);
  const isEmbeddingPending = useSelector(selectIsEmbeddingPending);

  const isFetchDashboardProfilesRecommendationsIdle = useSelector(
    fetchDashboardProfilesRecommendationsSelectors.selectIsFetchDashboardProfilesRecommendationsIdle
  );

  const isFetchDashboardProfilesRecommendationsRequested = useSelector(
    fetchDashboardProfilesRecommendationsSelectors.selectIsFetchDashboardProfilesRecommendationsRequested
  );

  const isLoading =
    isFetchDashboardProfilesRecommendationsIdle ||
    isFetchDashboardProfilesRecommendationsRequested;

  const isFetchDashboardProfilesRecommendationsFailed = useSelector(
    fetchDashboardProfilesRecommendationsSelectors.selectIsFetchDashboardProfilesRecommendationsFailed
  );

  const isFetchDashboardProfilesFailed = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesFailed
  );

  const isError =
    isFetchDashboardProfilesRecommendationsFailed ||
    isFetchDashboardProfilesFailed;

  // fetch recommendations or profiles on mount
  useEffect(() => {
    if (isFetchDashboardProfilesRecommendationsIdle) {
      dispatch(
        profilesActions.fetchDashboardProfilesRecommendationsRequested()
      );
    }
  }, [dispatch, isFetchDashboardProfilesRecommendationsIdle]);

  // notif on error if recommendations fails
  useEffect(() => {
    if (isFetchDashboardProfilesRecommendationsFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            'Une erreur est survenue lors de la récupération des recommandations',
        })
      );
    }
    if (isFetchDashboardProfilesFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            'Une erreur est survenue lors de la récupération des profils',
        })
      );
    }
  }, [
    dispatch,
    isFetchDashboardProfilesRecommendationsFailed,
    isFetchDashboardProfilesFailed,
  ]);

  const [, { reset: resetFetchDashboardProfilesRecommendations }] =
    useFetchDashboardProfilesRecommendationsMutation({
      fixedCacheKey: FETCH_DASHBOARD_PROFILES_RECOMMENDATIONS_FIXED_CACHE_KEY,
    });

  // clean on unmount depending on context
  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchDashboardProfilesRecommendationsReset());
      resetFetchDashboardProfilesRecommendations();
    };
  }, [dispatch, resetFetchDashboardProfilesRecommendations]);

  return { recommendations, isLoading, isError, isEmbeddingPending };
}
