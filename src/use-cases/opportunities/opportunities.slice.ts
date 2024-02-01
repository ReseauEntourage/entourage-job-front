import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Opportunity, OpportunityTabCount, OpportunityType } from 'src/api/types';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
    fetchOpportunitiesAdapter,
    fetchOpportunitiesTabCountsAdapter,
} from './opportunities.adapters';

export interface State {
    fetchOpportunities: RequestState<typeof fetchOpportunitiesAdapter>;
    fetchOpportunitiesTabCounts: RequestState<typeof fetchOpportunitiesTabCountsAdapter>;
    opportunities: Opportunity[];
    opportunitiesFilters: {
        candidateId: string;
        type: OpportunityType;
        department: Department[];
        limit: number;
        offset: number;
        search: string;
        businessLines: BusinessLineValue[];
    };
    opportunitiesHasFetchedAll: boolean;
    opportunitiesTabCounts: OpportunityTabCount[];
}

const initialState: State = {
    fetchOpportunities: fetchOpportunitiesAdapter.getInitialState(),
    fetchOpportunitiesTabCounts: fetchOpportunitiesTabCountsAdapter.getInitialState(),
    opportunities: [],
    opportunitiesFilters: {
        candidateId: '',
        type: 'public',
        department: [],
        limit: 25,
        offset: 0,
        search: '',
        businessLines: [],
    },
    opportunitiesHasFetchedAll: false,
    opportunitiesTabCounts: [],
};

export const slice = createSlice({
    name: 'opportunities',
    initialState,
    reducers: {
        ...fetchOpportunitiesAdapter.getReducers<State>((state) => state.fetchOpportunities, {
            fetchOpportunitiesSucceeded(state, action) {
                state.opportunities =
                    state.opportunitiesFilters.offset === 0
                        ? action.payload
                        : [...state.opportunities, ...action.payload];
                state.opportunitiesHasFetchedAll = action.payload.length < state.opportunitiesFilters.limit;
            },
        }),
        ...fetchOpportunitiesTabCountsAdapter.getReducers<State>(
            (state) => state.fetchOpportunitiesTabCounts,
            {
                fetchOpportunitiesTabCountsSucceeded(state, action) {
                    state.opportunitiesTabCounts = action.payload;
                },
            }
        ),
        setOpportunitiesFilter(state, action: PayloadAction<Partial<State['opportunitiesFilters']>>) {
            state.opportunitiesFilters = {
                ...state.opportunitiesFilters,
                ...action.payload,
                offset: 0,
            };
            state.opportunitiesHasFetchedAll = false;
            state.opportunities = [];
        },
        incrementOpportunitiesOffset(state) {
            state.opportunitiesFilters = {
                ...state.opportunitiesFilters,
                offset:  state.opportunitiesHasFetchedAll ?
                state.opportunitiesFilters.offset :
                state.opportunitiesFilters.offset + state.opportunitiesFilters.limit,
            };
        },
    },
});

export type RootState = SliceRootState<typeof slice>;
