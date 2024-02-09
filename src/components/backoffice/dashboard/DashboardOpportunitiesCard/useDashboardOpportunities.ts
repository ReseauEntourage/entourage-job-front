import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { OpportunitiesFiltersForCandidate } from 'src/api/types';
import { selectCandidateProfileDefaultFiltersForDashboardOpportunities } from 'src/use-cases/authentication';
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
  const isFetchOpportunitiesIdle = useSelector(
    fetchDashboardOpportunitiesSelectors.selectIsFetchDashboardOpportunitiesIdle
  );
  const isFetchOpportunitiesRequested = useSelector(
    fetchDashboardOpportunitiesSelectors.selectIsFetchDashboardOpportunitiesRequested
  );
  const isFetchOpportunitiesFailed = useSelector(
    fetchOpportunitiesAsCandidateSelectors.selectIsFetchOpportunitiesAsCandidateFailed
  );
  const isDataLoading =
    isFetchOpportunitiesIdle || isFetchOpportunitiesRequested;

  // default filters
  const [opportunitiesDefaultFilters, setOpportunitiesDefaultFilter] =
    useState<OpportunitiesFiltersForCandidate>();
  const candidateProfileDefaultFilters = useSelector(
    selectCandidateProfileDefaultFiltersForDashboardOpportunities
  );

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

  // requests on opportunities and counts + reset on unmount
  useEffect(() => {
    if (isFetchOpportunitiesIdle) {
      dispatch(opportunitiesActions.fetchDashboardOpportunitiesRequested());
    }
    if (isFetchOpportunitiesTabCountsIdle) {
      dispatch(opportunitiesActions.fetchOpportunitiesTabCountsRequested());
    }
    return () => {
      dispatch(opportunitiesActions.fetchDashboardOpportunitiesReset());
      dispatch(opportunitiesActions.fetchOpportunitiesTabCountsReset());
    };
  }, [dispatch, isFetchOpportunitiesIdle, isFetchOpportunitiesTabCountsIdle]);

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

  // set complete default filters for button
  useEffect(() => {
    if (candidateProfileDefaultFilters) {
      setOpportunitiesDefaultFilter({
        type: 'public',
        ...candidateProfileDefaultFilters,
      });
    }
  }, [dispatch, candidateProfileDefaultFilters]);

  return {
    opportunities,
    numberOpportunitiesInProgess,
    opportunitiesDefaultFilters,
    isDataLoading,
  };
};
