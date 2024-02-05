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

export const fetchOpportunitiesTabCountsAdapter = createRequestAdapter(
  'fetchOpportunitiesTabCounts'
).withPayloads<
  string, // userId
  OpportunityTabCount[]
>();
