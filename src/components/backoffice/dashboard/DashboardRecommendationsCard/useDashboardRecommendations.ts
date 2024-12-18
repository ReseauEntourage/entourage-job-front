import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsActions } from 'src/use-cases/notifications';

import {
  fetchProfilesRecommendationsSelectors,
  profilesActions,
  selectProfilesRecommendations,
} from 'src/use-cases/profiles';

export function useDashboardRecommendations() {
  const dispatch = useDispatch();

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

  const isError = isFetchDashboardRecommendationsFailed;

  // fetch recommendations
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
  }, [dispatch, isFetchDashboardRecommendationsFailed]);

  // clean on unmount
  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchProfilesRecommendationsReset());
    };
  }, [dispatch]);

  return { recommendations, isLoading, isError };
}
