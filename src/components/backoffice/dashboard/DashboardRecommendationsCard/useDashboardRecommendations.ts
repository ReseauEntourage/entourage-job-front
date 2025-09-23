import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { notificationsActions } from 'src/use-cases/notifications';

import {
  fetchProfilesRecommendationsSelectors,
  fetchProfilesSelectors,
  profilesActions,
  selectProfiles,
  selectProfilesRecommendations,
} from 'src/use-cases/profiles';

/**
 *
 * @param isCompanyAdminContext Indicates if the current user is a company admin
 *
 * In case of context of company admin, fetch profiles instead of recommendations - so the list
 * is generated from profiles and isLoading is based on profiles fetch instead of recommendations fetch
 *
 * @returns
 */
export function useDashboardRecommendations(isCompanyAdminContext: boolean) {
  const dispatch = useDispatch();

  const recommendations = useSelector(selectProfilesRecommendations);
  const profiles = useSelector(selectProfiles);

  const isFetchProfilesRecommendationsIdle = useSelector(
    fetchProfilesRecommendationsSelectors.selectIsFetchProfilesRecommendationsIdle
  );

  const isFetchProfilesRecommendationsRequested = useSelector(
    fetchProfilesRecommendationsSelectors.selectIsFetchProfilesRecommendationsRequested
  );

  const isFetchProfilesIdle = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesIdle
  );

  const isFetchProfilesRequested = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesRequested
  );

  const isLoading = isCompanyAdminContext
    ? isFetchProfilesIdle || isFetchProfilesRequested
    : isFetchProfilesRecommendationsIdle ||
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
    if (isCompanyAdminContext) {
      if (isFetchProfilesIdle) {
        dispatch(
          profilesActions.fetchProfilesRequested({
            role: [UserRoles.CANDIDATE],
            departments: [],
            nudgeIds: [],
            businessSectorIds: [], // TODO: Bind to company activity sector
            contactTypes: [],
          })
        );
      }
    } else if (isFetchProfilesRecommendationsIdle) {
      dispatch(profilesActions.fetchProfilesRecommendationsRequested());
    }
  }, [
    dispatch,
    isCompanyAdminContext,
    isFetchProfilesIdle,
    isFetchProfilesRecommendationsIdle,
  ]);

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
      if (isCompanyAdminContext) dispatch(profilesActions.fetchProfilesReset());
      dispatch(profilesActions.fetchProfilesRecommendationsReset());
    };
  }, [dispatch, isCompanyAdminContext]);

  return { recommendations, profiles, isLoading, isError };
}
