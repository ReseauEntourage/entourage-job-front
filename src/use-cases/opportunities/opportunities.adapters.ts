import {
  OpportunitiesFiltersForCandidate,
  Opportunity,
  OpportunityTabCount,
} from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchOpportunitiesAsCandidateAdapter = createRequestAdapter(
  'fetchOpportunitiesAsCandidate'
).withPayloads<
  OpportunitiesFiltersForCandidate & {
    candidateId: string;
    limit: number;
  },
  Opportunity[]
>();

export const fetchDashboardOpportunitiesAdapter = createRequestAdapter(
  'fetchDashboardOpportunities'
).withPayloads<void, Opportunity[]>();

export const fetchOpportunitiesTabCountsAdapter = createRequestAdapter(
  'fetchOpportunitiesTabCounts'
).withPayloads<void, OpportunityTabCount[]>();
