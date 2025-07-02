import Router from 'next/router';
import { call, put, takeLatest } from 'typed-redux-saga';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import { currentUserActions } from 'src/use-cases/current-user';
import { slice } from './cv.slice';

const {
  generateProfileFromCVRequested,
  generateProfileFromCVSucceeded,
  generateProfileFromCVFailed,
} = slice.actions;

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
  yield* takeLatest(
    generateProfileFromCVRequested,
    generateProfileFromCVSagaRequested
  );
}
