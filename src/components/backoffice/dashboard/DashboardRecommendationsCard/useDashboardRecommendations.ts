import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';

import {
  fetchProfilesRecommendationsSelectors,
  fetchProfilesSelectors,
  profilesActions,
  selectProfilesRecommendations,
} from 'src/use-cases/profiles';

/**
 * @returns {Object} An object containing:
 *   - recommendations: The list of recommended profiles.
 *   - isLoading: Boolean indicating if data is being loaded.
 *   - isError: Boolean indicating if there was an error fetching data.
 */
export function useDashboardRecommendations() {
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const recommendations = useSelector(selectProfilesRecommendations);

  const isFetchProfilesRecommendationsIdle = useSelector(
    fetchProfilesRecommendationsSelectors.selectIsFetchProfilesRecommendationsIdle
  );

  const isFetchProfilesRecommendationsRequested = useSelector(
    fetchProfilesRecommendationsSelectors.selectIsFetchProfilesRecommendationsRequested
  );

  const isLoading =
    isFetchProfilesRecommendationsIdle ||
    isFetchProfilesRecommendationsRequested;

  const isFetchDashboardRecommendationsFailed = useSelector(
    fetchProfilesRecommendationsSelectors.selectIsFetchProfilesRecommendationsFailed
  );

  const isFetchDashboardProfilesFailed = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesFailed
  );

  const isError =
    isFetchDashboardRecommendationsFailed || isFetchDashboardProfilesFailed;

  // fetch recommendations or profiles on mount
  useEffect(() => {
    if (isFetchProfilesRecommendationsIdle) {
      dispatch(profilesActions.fetchProfilesRecommendationsRequested());
    }
  }, [dispatch, isFetchProfilesRecommendationsIdle]);

  // notif on error if recommendations fails
  useEffect(() => {
    if (isFetchDashboardRecommendationsFailed) {
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
    isFetchDashboardRecommendationsFailed,
    isFetchDashboardProfilesFailed,
  ]);

  // clean on unmount depending on context
  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchProfilesRecommendationsReset());
    };
  }, [dispatch]);

  return { recommendations, isLoading, isError };
}
