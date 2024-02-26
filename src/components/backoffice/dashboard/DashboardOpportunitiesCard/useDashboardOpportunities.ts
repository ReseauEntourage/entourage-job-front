import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
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
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  }, [isFetchOpportunitiesFailed, dispatch]);

  // notif on error for tab counts fails
  useEffect(() => {
    if (isFetchOpportunitiesTabCountsFailed) {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  }, [isFetchOpportunitiesTabCountsFailed, dispatch]);

  return {
    opportunities,
    numberOpportunitiesInProgess,
    isDataLoading,
  };
};
