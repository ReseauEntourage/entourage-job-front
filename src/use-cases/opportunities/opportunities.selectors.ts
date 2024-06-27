import {
  fetchDashboardOpportunitiesAdapter,
  fetchOpportunitiesAsCandidateAdapter,
  fetchOpportunitiesTabCountsAdapter,
} from './opportunities.adapters';
import { RootState } from './opportunities.slice';

export const fetchOpportunitiesAsCandidateSelectors =
  fetchOpportunitiesAsCandidateAdapter.getSelectors<RootState>(
    (state) => state.opportunities.fetchOpportunitiesAsCandidate
  );

export const fetchOpportunitiesTabCountsSelectors =
  fetchOpportunitiesTabCountsAdapter.getSelectors<RootState>(
    (state) => state.opportunities.fetchOpportunitiesTabCounts
  );

export const fetchDashboardOpportunitiesSelectors =
  fetchDashboardOpportunitiesAdapter.getSelectors<RootState>(
    (state) => state.opportunities.fetchDashboardOpportunities
  );

export function selectOpportunities(state: RootState) {
  return state.opportunities.opportunities;
}

export function selectDashboardOpportunities(state: RootState) {
  return state.opportunities.dashboardOpportunities;
}

export function selectOpportunitiesHasFetchedAll(state: RootState) {
  return state.opportunities.opportunitiesHasFetchedAll;
}

export function selectOpportunitiesTabCounts(state: RootState) {
  return state.opportunities.opportunitiesTabCounts;
}

export function selectNumberOfOpportunitiesInProgress(state: RootState) {
  return state.opportunities.opportunitiesTabCounts.find(
    (tabCount) => tabCount.status === -1
  )?.count;
}

export const extraSelectors = {
  ...fetchOpportunitiesAsCandidateSelectors,
  ...fetchOpportunitiesTabCountsSelectors,
  ...fetchDashboardOpportunitiesSelectors,
  selectOpportunities,
  selectDashboardOpportunities,
  selectOpportunitiesHasFetchedAll,
  selectOpportunitiesTabCounts,
  selectNumberOfOpportunitiesInProgress,
};
