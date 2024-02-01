import {
    fetchOpportunitiesAdapter,
    fetchOpportunitiesTabCountsAdapter,
} from './opportunities.adapters';
import { RootState } from './opportunities.slice';


export const fetchOpportunitiesSelectors = 
    fetchOpportunitiesAdapter.getSelectors<RootState>(
        (state) => state.opportunities.fetchOpportunities
);

export const fetchOpportunitiesTabCountsSelectors =
    fetchOpportunitiesTabCountsAdapter.getSelectors<RootState>(
        (state) => state.opportunities.fetchOpportunitiesTabCounts
);

export function selectOpportunities(state: RootState) {
    return state.opportunities.opportunities;
};

export function selectOpportunitiesFilters(state: RootState) {
    return state.opportunities.opportunitiesFilters;
}

export function selectOpportunitiesHasFetchedAll(state: RootState) {
    return state.opportunities.opportunitiesHasFetchedAll;
}

export function selectOpportunitiesTabCounts(state: RootState) {
    return state.opportunities.opportunitiesTabCounts;
}