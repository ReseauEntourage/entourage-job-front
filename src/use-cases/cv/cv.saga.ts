import Router from 'next/router';
import { call, put, takeLatest, select } from 'typed-redux-saga';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import {
  currentUserActions,
  selectCandidateId,
} from 'src/use-cases/current-user';
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
    const response = yield* call(() => Api.getGenerateProfileFromCV());
    yield* put(generateProfileFromCVSucceeded(response.data));
    yield* put(currentUserActions.fetchCompleteUserRequested());
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: `Le profil a été généré avec succès`,
      })
    );
    try {
      Router.push('/backoffice/parametres');
    } catch (error) {
      console.error('Erreur lors de la redirection:', error);
    }
  } catch {
    yield* put(generateProfileFromCVFailed());
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: `Une erreur est survenue lors de la génération du profil. Veuillez réessayer.`,
      })
    );
  }
}

export function* saga() {
  yield* takeLatest(fetchCVRequested, fetchCVSagaRequested);
  yield* takeLatest(
    generateProfileFromCVRequested,
    generateProfileFromCVSagaRequested
  );
}
