import { call, put, select, takeLatest } from 'typed-redux-saga';
import { selectProfilesOffset } from '../profiles';
import { Api } from 'src/api';
import { Opportunity } from 'src/api/types';
import { mutateToArray } from 'src/utils';
import { slice } from './opportunities.slice';

const {
  fetchOpportunitiesAsCandidateSucceeded,
  fetchOpportunitiesAsCandidateFailed,
  fetchOpportunitiesAsCandidateRequested,
  fetchOpportunitiesTabCountsSucceeded,
  fetchOpportunitiesTabCountsFailed,
  fetchOpportunitiesTabCountsRequested,
  fetchOpportunitiesAsCandidateWithFilters,
  resetOpportunitiesOffset,
} = slice.actions;

function* fetchOpportunitiesAsCandidateRequestedSaga(
  action: ReturnType<typeof fetchOpportunitiesAsCandidateRequested>
) {
  try {
    const { candidateId, department, businessLines, ...restFilters } =
      action.payload;
    const offset = yield* select(selectProfilesOffset);
    const response = yield* call(() =>
      Api.getAllCandidateOpportunities(candidateId, {
        params: {
          ...restFilters,
          department: mutateToArray(department),
          businessLines: mutateToArray(businessLines),
          offset,
        },
      })
    );
    yield* put(
      fetchOpportunitiesAsCandidateSucceeded(
        response.data.offers as Opportunity[]
      )
    );
  } catch {
    yield* put(fetchOpportunitiesAsCandidateFailed());
  }
}

function* fetchOpportunitiesAsCandidateWithFiltersSaga(
  action: ReturnType<typeof fetchOpportunitiesAsCandidateWithFilters>
) {
  yield* put(resetOpportunitiesOffset());
  yield* put(fetchOpportunitiesAsCandidateRequested(action.payload));
}

function* fetchOpportunitiesTabCountsSaga(
  action: ReturnType<typeof fetchOpportunitiesTabCountsRequested>
) {
  try {
    const response = yield* call(() =>
      Api.getOpportunitiesTabCountByCandidate(action.payload)
    );
    yield* put(fetchOpportunitiesTabCountsSucceeded(response.data));
  } catch {
    yield* put(fetchOpportunitiesTabCountsFailed());
  }
}

export function* saga() {
  yield* takeLatest(
    fetchOpportunitiesAsCandidateRequested,
    fetchOpportunitiesAsCandidateRequestedSaga
  );
  yield* takeLatest(
    fetchOpportunitiesTabCountsRequested,
    fetchOpportunitiesTabCountsSaga
  );
  yield* takeLatest(
    fetchOpportunitiesAsCandidateWithFilters,
    fetchOpportunitiesAsCandidateWithFiltersSaga
  );
}
