import { call, put, takeLatest } from 'typed-redux-saga';
import { currentUserActions } from '../current-user';
import { Api } from 'src/api';
import { slice } from './profile-completion.slice';

const {
  fetchProfileCompletionRequested,
  fetchProfileCompletionSucceeded,
  fetchProfileCompletionFailed,
} = slice.actions;

function* fetchProfileCompletionSaga() {
  try {
    const { data } = yield* call(() => Api.getProfileCompletion());
    yield* put(fetchProfileCompletionSucceeded(data || 0));
  } catch (error) {
    yield* put(fetchProfileCompletionFailed(null));
  }
}

// Saga qui écoute les mises à jour de profil et déclenche la récupération du taux de complétion
function* refreshProfileCompletionSaga() {
  try {
    // On attend un peu pour s'assurer que le back a bien traité la mise à jour
    yield new Promise((resolve) => setTimeout(resolve, 300));
    yield* call(fetchProfileCompletionSaga);
  } catch (error) {
    console.error(
      'Erreur lors du rafraîchissement du taux de complétion:',
      error
    );
  }
}

export function* saga() {
  yield* takeLatest(
    fetchProfileCompletionRequested.type,
    fetchProfileCompletionSaga
  );

  // Écouter les actions de mise à jour du profil
  yield* takeLatest(
    currentUserActions.updateProfileSucceeded.type,
    refreshProfileCompletionSaga
  );

  // Écouter aussi les mises à jour du candidat
  yield* takeLatest(
    currentUserActions.updateCandidateSucceeded.type,
    refreshProfileCompletionSaga
  );

  // Écouter les mises à jour de la photo de profil
  yield* takeLatest(
    currentUserActions.updateUserProfilePictureSucceeded.type,
    refreshProfileCompletionSaga
  );

  // Écouter les mises à jour du CV externe
  yield* takeLatest(
    currentUserActions.uploadExternalCvSucceeded.type,
    refreshProfileCompletionSaga
  );

  // Écouter les suppressions du CV externe
  yield* takeLatest(
    currentUserActions.deleteExternalCvSucceeded.type,
    refreshProfileCompletionSaga
  );
}
