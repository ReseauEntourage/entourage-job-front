import { call, put, takeLatest, select } from 'typed-redux-saga';
import { Api } from 'src/api';
import { selectCandidateId } from 'src/use-cases/current-user';
import { slice } from './cv.slice';

const {
  fetchCVSucceeded,
  fetchCVFailed,
  fetchCVRequested,
  generateProfileFromCVRequested,
  generateProfileFromCVSucceeded,
  generateProfileFromCVFailed,
} = slice.actions;

function* fetchCVSagaRequested() {
  const candidateId = yield* select(selectCandidateId);

  try {
    const response = yield* call(() => Api.getCVByCandidateId(candidateId));
    yield* put(fetchCVSucceeded(response.data));
  } catch {
    yield* put(fetchCVFailed());
  }
}

function* generateProfileFromCVSagaRequested() {
  try {
    // Remplacez cette ligne par l'appel API réel à votre API de génération de profil
    const response = yield* call(() => Api.getGenerateProfileFromCV());
    yield* put(generateProfileFromCVSucceeded(response.data));
  } catch {
    yield* put(generateProfileFromCVFailed());
  }
}

export function* saga() {
  yield* takeLatest(fetchCVRequested, fetchCVSagaRequested);
  yield* takeLatest(
    generateProfileFromCVRequested,
    generateProfileFromCVSagaRequested
  );
}
