import { call, put, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { slice } from './cv.slice';

const { fetchCVSucceeded, fetchCVFailed, fetchCVRequested } = slice.actions;

function* fetchCVSagaRequested(action: ReturnType<typeof fetchCVRequested>) {
  const candidateId = action.payload;

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
