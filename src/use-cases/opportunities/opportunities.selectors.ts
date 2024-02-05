import {
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

export function selectOpportunities(state: RootState) {
  return state.opportunities.opportunities;
}

export function selectOpportunitiesHasFetchedAll(state: RootState) {
  return state.opportunities.opportunitiesHasFetchedAll;
}

export function selectOpportunitiesTabCounts(state: RootState) {
  return state.opportunities.opportunitiesTabCounts;
}
