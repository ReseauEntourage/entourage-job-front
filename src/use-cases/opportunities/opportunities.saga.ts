import { call, put, select, takeLatest } from 'typed-redux-saga';
import {
  selectCandidateId,
  selectCandidateProfileDefaultFiltersForDashboardOpportunities,
} from '../authentication';
import { selectProfilesOffset } from '../profiles';
import { Api } from 'src/api';
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
  fetchDashboardOpportunitiesSucceeded,
  fetchDashboardOpportunitiesFailed,
  fetchDashboardOpportunitiesRequested,
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
    yield* put(fetchOpportunitiesAsCandidateSucceeded(response.data.offers));
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

function* fetchOpportunitiesTabCountsSaga() {
  const candidateId = yield* select(selectCandidateId);
  if (!candidateId) return;
  try {
    const response = yield* call(() =>
      Api.getOpportunitiesTabCountByCandidate(candidateId)
    );
    yield* put(fetchOpportunitiesTabCountsSucceeded(response.data));
  } catch {
    yield* put(fetchOpportunitiesTabCountsFailed());
  }
}

function* fetchDashboardOpportunitiesSaga() {
  const candidateId = yield* select(selectCandidateId);
  const defaultFilters = yield* select(
    selectCandidateProfileDefaultFiltersForDashboardOpportunities
  );
  if (!candidateId) return null;
  try {
    const response = yield* call(() =>
      Api.getAllCandidateOpportunities(candidateId, {
        params: {
          offset: 0,
          limit: 3,
          type: 'public',
          ...defaultFilters,
        },
      })
    );
    yield* put(fetchDashboardOpportunitiesSucceeded(response.data.offers));
  } catch {
    yield* put(fetchDashboardOpportunitiesFailed());
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
  yield* takeLatest(
    fetchDashboardOpportunitiesRequested,
    fetchDashboardOpportunitiesSaga
  );
}
