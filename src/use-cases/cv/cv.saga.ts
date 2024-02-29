import { call, put, takeLatest, select } from 'typed-redux-saga';
import { Api } from 'src/api';
import { selectCandidateId } from 'src/use-cases/current-user';
import { slice } from './cv.slice';

const { fetchCVSucceeded, fetchCVFailed, fetchCVRequested } = slice.actions;

function* fetchCVSagaRequested() {
  const candidateId = yield* select(selectCandidateId);

  try {
    const response = yield* call(() => Api.getCVByCandidateId(candidateId));
    yield* put(fetchCVSucceeded(response.data));
  } catch {
    yield* put(fetchCVFailed());
  }
}

export function* saga() {
  yield* takeLatest(fetchCVRequested, fetchCVSagaRequested);
}
