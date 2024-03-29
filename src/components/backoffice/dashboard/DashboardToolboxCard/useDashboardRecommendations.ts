import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import UIkit from 'uikit';
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

  // fetch recommendations
  useEffect(() => {
    if (isFetchProfilesRecommendationsIdle) {
      dispatch(profilesActions.fetchProfilesRecommendationsRequested());
    }
  }, [dispatch, isFetchProfilesRecommendationsIdle]);

  // notif on error if recommendations fails
  useEffect(() => {
    if (isFetchDashboardRecommendationsFailed) {
      UIkit.notification(
        'Une erreur est survenue lors de la récupération des recommendations',
        'danger'
      );
    }
  }, [dispatch, isFetchDashboardRecommendationsFailed]);

  // clean on unmount
  useEffect(() => {
    return () => {
      dispatch(profilesActions.fetchProfilesRecommendationsReset());
    };
  }, [dispatch]);

  return { recommendations, isLoading };
}
