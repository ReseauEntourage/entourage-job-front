import { createSelector } from '@reduxjs/toolkit';
import {
  fetchRecruitementAlertsAdapter,
  fetchRecruitementAlertMatchingAdapter,
} from './recruitement-alerts.adapters';
import { RootState } from './recruitement-alerts.slice';

const fetchRecruitementAlertsSelectors =
  fetchRecruitementAlertsAdapter.getSelectors<RootState>(
    (state) => state.recruitementAlerts.fetchRecruitementAlerts
  );

const fetchRecruitementAlertMatchingSelectors =
  fetchRecruitementAlertMatchingAdapter.getSelectors<RootState>(
    (state) => state.recruitementAlerts.fetchRecruitementAlertMatching
  );

export const selectRecruitementAlerts = (state: RootState) =>
  state.recruitementAlerts.recruitementAlerts;

// Using createSelector to memoize the selectors result
export const selectRecruitementAlertMatchingById = (alertId: string) =>
  createSelector(
    (state: RootState) =>
      state.recruitementAlerts.recruitementAlertMatchings[alertId],
    (matching) => matching || { profiles: [], timestamp: 0 }
  );

export const selectFetchRecruitementAlertsLoading = createSelector(
  fetchRecruitementAlertsSelectors.selectIsFetchRecruitementAlertsRequested,
  (isRequested) => isRequested
);

export const selectFetchRecruitementAlertMatchingLoading = createSelector(
  fetchRecruitementAlertMatchingSelectors.selectIsFetchRecruitementAlertMatchingRequested,
  (isRequested) => isRequested
);
