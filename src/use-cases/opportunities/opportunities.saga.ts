import { call, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { slice } from './opportunities.slice';
import {
    selectOpportunitiesFilters,
    selectOpportunitiesHasFetchedAll,
} from './opportunities.selectors';

const {
    fetchOpportunitiesSucceeded,
    fetchOpportunitiesFailed,
    fetchOpportunitiesRequested,
    fetchOpportunitiesTabCountsSucceeded,
    fetchOpportunitiesTabCountsFailed,
    fetchOpportunitiesTabCountsRequested,
    setOpportunitiesFilter,
    incrementOpportunitiesOffset,
}= slice.actions;

function* fetchOpportunitiesSagaRequested() {
    const hasFetchedAll = yield* select(selectOpportunitiesHasFetchedAll);

    if (!hasFetchedAll) {
        yield* put(fetchOpportunitiesRequested());
    }
}

function* fetchOpportunitiesSaga() {
    try {
        const {candidateId, ...restFilters} = yield* select(selectOpportunitiesFilters);
        const response = yield* call(() => Api.getAllCandidateOpportunities(candidateId, {params: restFilters}));
        yield* put(fetchOpportunitiesSucceeded(response.data.offers));
    } catch {
        yield* put(fetchOpportunitiesFailed());
    }
}

function* fetchOpportunitiesTabCountsSaga(
    action: ReturnType<typeof fetchOpportunitiesTabCountsRequested>
) {
    try {
        const response = yield* call(() => Api.getOpportunitiesTabCountByCandidate(action.payload));
        yield* put(fetchOpportunitiesTabCountsSucceeded(response.data));
    } catch {
        yield* put(fetchOpportunitiesTabCountsFailed());
    }
}


export function* saga() {
    yield* takeLatest(fetchOpportunitiesRequested, fetchOpportunitiesSaga);
    yield* takeLatest(setOpportunitiesFilter, fetchOpportunitiesSagaRequested);
    yield* takeLatest(incrementOpportunitiesOffset, fetchOpportunitiesSagaRequested);
    yield* takeLatest(fetchOpportunitiesTabCountsRequested, fetchOpportunitiesTabCountsSaga);
}