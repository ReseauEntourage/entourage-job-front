import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  fetchOpportunitiesAsCandidateSelectors,
  fetchOpportunitiesTabCountsSelectors,
  opportunitiesActions,
  fetchDashboardOpportunitiesSelectors,
  selectDashboardOpportunities,
  selectNumberOfOpportunitiesInProgress,
} from 'src/use-cases/opportunities';

export const useDashboardOpportunities = () => {
  const dispatch = useDispatch();
  // opportunities
  const opportunities = useSelector(selectDashboardOpportunities);
  const isFetchDashboardOpportunitiesIdle = useSelector(
    fetchDashboardOpportunitiesSelectors.selectIsFetchDashboardOpportunitiesIdle
  );
  const isFetchDashboardOpportunitiesRequested = useSelector(
    fetchDashboardOpportunitiesSelectors.selectIsFetchDashboardOpportunitiesRequested
  );
  const isFetchOpportunitiesFailed = useSelector(
    fetchOpportunitiesAsCandidateSelectors.selectIsFetchOpportunitiesAsCandidateFailed
  );
  const isDataLoading =
    isFetchDashboardOpportunitiesIdle || isFetchDashboardOpportunitiesRequested;

  // number of opportunities in progress
  const numberOpportunitiesInProgess = useSelector(
    selectNumberOfOpportunitiesInProgress
  );
  const isFetchOpportunitiesTabCountsFailed = useSelector(
    fetchOpportunitiesTabCountsSelectors.selectIsFetchOpportunitiesTabCountsFailed
  );
  const isFetchOpportunitiesTabCountsIdle = useSelector(
    fetchOpportunitiesTabCountsSelectors.selectIsFetchOpportunitiesTabCountsIdle
  );

  // fetch opportunities
  useEffect(() => {
    if (isFetchDashboardOpportunitiesIdle) {
      dispatch(opportunitiesActions.fetchDashboardOpportunitiesRequested());
    }
  }, [dispatch, isFetchDashboardOpportunitiesIdle]);

  // fetch tab counts
  useEffect(() => {
    if (isFetchOpportunitiesTabCountsIdle) {
      dispatch(opportunitiesActions.fetchOpportunitiesTabCountsRequested());
    }
  }, [dispatch, isFetchOpportunitiesTabCountsIdle]);

  // clean on unmount
  useEffect(() => {
    return () => {
      dispatch(opportunitiesActions.fetchDashboardOpportunitiesReset());
      dispatch(opportunitiesActions.fetchOpportunitiesTabCountsReset());
    };
  }, [dispatch]);

  // notif on error for opportunitie fails
  useEffect(() => {
    if (isFetchOpportunitiesFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [isFetchOpportunitiesFailed, dispatch]);

  // notif on error for tab counts fails
  useEffect(() => {
    if (isFetchOpportunitiesTabCountsFailed) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [isFetchOpportunitiesTabCountsFailed, dispatch]);

  return {
    opportunities,
    numberOpportunitiesInProgess,
    isDataLoading,
  };
};
