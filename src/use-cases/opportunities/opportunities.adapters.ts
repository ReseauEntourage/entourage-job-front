import { Opportunity, OpportunityTabCount, OpportunityType } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchOpportunitiesAdapter = createRequestAdapter(
    'fetchOpportunities'
).withPayloads<void, Opportunity[]>();



export const fetchOpportunitiesTabCountsAdapter = createRequestAdapter(
    'fetchOpportunitiesTabCounts'
).withPayloads<
    string, // userId
    OpportunityTabCount[]
>();