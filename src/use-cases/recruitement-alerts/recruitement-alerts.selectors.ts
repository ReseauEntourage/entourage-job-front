import { createSelector } from '@reduxjs/toolkit';
import {
  fetchRecruitementAlertsAdapter,
  createRecruitementAlertAdapter,
  updateRecruitementAlertAdapter,
  fetchRecruitementAlertMatchingAdapter,
} from './recruitement-alerts.adapters';
import { RootState } from './recruitement-alerts.slice';

export const fetchRecruitementAlertsSelectors =
  fetchRecruitementAlertsAdapter.getSelectors<RootState>(
    (state) => state.recruitementAlerts.fetchRecruitementAlerts
  );

export const createRecruitementAlertSelectors =
  createRecruitementAlertAdapter.getSelectors<RootState>(
    (state) => state.recruitementAlerts.createRecruitementAlert
  );

export const updateRecruitementAlertSelectors =
  updateRecruitementAlertAdapter.getSelectors<RootState>(
    (state) => state.recruitementAlerts.updateRecruitementAlert
  );

export const fetchRecruitementAlertMatchingSelectors =
  fetchRecruitementAlertMatchingAdapter.getSelectors<RootState>(
    (state) => state.recruitementAlerts.fetchRecruitementAlertMatching
  );

export const selectRecruitementAlerts = (state: RootState) =>
  state.recruitementAlerts.recruitementAlerts;

export const selectRecruitementAlertMatchings = (state: RootState) =>
  state.recruitementAlerts.recruitementAlertMatchings;

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

export const selectCreateRecruitementAlertLoading = createSelector(
  createRecruitementAlertSelectors.selectIsCreateRecruitementAlertRequested,
  (isRequested) => isRequested
);

export const selectUpdateRecruitementAlertLoading = createSelector(
  updateRecruitementAlertSelectors.selectIsUpdateRecruitementAlertRequested,
  (isRequested) => isRequested
);

export const selectFetchRecruitementAlertMatchingLoading = createSelector(
  fetchRecruitementAlertMatchingSelectors.selectIsFetchRecruitementAlertMatchingRequested,
  (isRequested) => isRequested
);
