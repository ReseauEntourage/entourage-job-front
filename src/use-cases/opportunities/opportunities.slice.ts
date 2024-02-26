import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  OpportunitiesFiltersForCandidate,
  Opportunity,
  OpportunityTabCount,
} from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  fetchDashboardOpportunitiesAdapter,
  fetchOpportunitiesAsCandidateAdapter,
  fetchOpportunitiesTabCountsAdapter,
} from './opportunities.adapters';

export interface State {
  fetchOpportunitiesAsCandidate: RequestState<
    typeof fetchOpportunitiesAsCandidateAdapter
  >;
  fetchOpportunitiesTabCounts: RequestState<
    typeof fetchOpportunitiesTabCountsAdapter
  >;
  fetchDashboardOpportunities: RequestState<
    typeof fetchDashboardOpportunitiesAdapter
  >;
  opportunities: Opportunity[];
  dashboardOpportunities: Opportunity[];
  opportunitiesHasFetchedAll: boolean;
  opportunitiesTabCounts: OpportunityTabCount[];
  opportunitiesOffset: number;
}

const initialState: State = {
  fetchOpportunitiesAsCandidate:
    fetchOpportunitiesAsCandidateAdapter.getInitialState(),
  fetchOpportunitiesTabCounts:
    fetchOpportunitiesTabCountsAdapter.getInitialState(),
  fetchDashboardOpportunities:
    fetchDashboardOpportunitiesAdapter.getInitialState(),
  opportunities: [],
  opportunitiesHasFetchedAll: false,
  opportunitiesTabCounts: [],
  dashboardOpportunities: [],
  opportunitiesOffset: 0,
};

export const slice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    ...fetchOpportunitiesAsCandidateAdapter.getReducers<State>(
      (state) => state.fetchOpportunitiesAsCandidate,
      {
        fetchOpportunitiesAsCandidateSucceeded(state, action) {
          state.opportunities =
            state.opportunitiesOffset === 0
              ? action.payload
              : [...state.opportunities, ...action.payload];
        },
      }
    ),
    ...fetchOpportunitiesTabCountsAdapter.getReducers<State>(
      (state) => state.fetchOpportunitiesTabCounts,
      {
        fetchOpportunitiesTabCountsSucceeded(state, action) {
          state.opportunitiesTabCounts = action.payload;
        },
      }
    ),
    ...fetchDashboardOpportunitiesAdapter.getReducers<State>(
      (state) => state.fetchDashboardOpportunities,
      {
        fetchDashboardOpportunitiesSucceeded(state, action) {
          state.dashboardOpportunities = action.payload;
        },
      }
    ),
    resetOpportunitiesOffset(state) {
      state.opportunitiesOffset = 0;
      state.opportunitiesHasFetchedAll = false;
      state.opportunities = [];
    },
    fetchOpportunitiesAsCandidateWithFilters(
      _state,
      _action: PayloadAction<
        OpportunitiesFiltersForCandidate & {
          candidateId: string;
          limit: number;
        }
      >
    ) {},
    setOpportunitiesHasFetchedAll(state, action: PayloadAction<boolean>) {
      state.opportunitiesHasFetchedAll = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
