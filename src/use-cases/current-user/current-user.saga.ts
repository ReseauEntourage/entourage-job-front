import { call, put, select, takeLatest } from 'typed-redux-saga';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import { STORAGE_KEYS } from 'src/constants';
import {
  authenticationActions,
  selectAccessToken,
} from 'src/use-cases/authentication';
import { assertCondition, assertIsDefined } from 'src/utils/asserts';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from './current-user.selectors';
import { slice } from './current-user.slice';

const {
  fetchUserRequested,
  setUser,
  fetchUserSucceeded,
  fetchUserFailed,
  updateUserRequested,
  fetchCompleteUserRequested,
  fetchCompleteUserSucceeded,
  fetchCompleteUserFailed,
  updateUserSucceeded,
  updateUserFailed,
  updateProfileRequested,
  updateProfileSucceeded,
  updateProfileFailed,
  updateCandidateRequested,
  updateCandidateSucceeded,
  updateCandidateFailed,
  readDocumentSucceeded,
  readDocumentRequested,
  readDocumentFailed,
  updateUserProfilePictureRequested,
  updateUserProfilePictureSucceeded,
  updateUserProfilePictureFailed,
  deleteExternalCvRequested,
  deleteExternalCvSucceeded,
  deleteExternalCvFailed,
  getExternalCvRequested,
  getExternalCvSucceeded,
  getExternalCvFailed,
} = slice.actions;

function getIsReleaseVersionAllowed() {
  const releaseVersion = localStorage.getItem(STORAGE_KEYS.RELEASE_VERSION);
  const herokuReleaseVersion =
    (process.env.NEXT_PUBLIC_HEROKU_RELEASE_VERSION as string) || '';

  return releaseVersion === herokuReleaseVersion;
}

function setReleaseVersion() {
  const herokuReleaseVersion =
    (process.env.NEXT_PUBLIC_HEROKU_RELEASE_VERSION as string) || '';

  localStorage.setItem(STORAGE_KEYS.RELEASE_VERSION, herokuReleaseVersion);
}

function* fetchUserRequestedSaga() {
  try {
    const isReleaseVersionAllowed = getIsReleaseVersionAllowed();
    if (!isReleaseVersionAllowed) {
      setReleaseVersion();
    }
    assertCondition(isReleaseVersionAllowed, 'Release version is not allowed');

    const accessToken = yield* select(selectAccessToken);

    assertIsDefined(accessToken, 'Access token is not set');

    const response = yield* call(() => Api.getAuthCurrent(false));

    yield* put(fetchUserSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchUserFailed());
  }
}

function* fetchCompleteUserRequestedSaga() {
  try {
    const isReleaseVersionAllowed = getIsReleaseVersionAllowed();
    if (!isReleaseVersionAllowed) {
      setReleaseVersion();
    }
    assertCondition(isReleaseVersionAllowed, 'Release version is not allowed');

    const accessToken = yield* select(selectAccessToken);

    assertIsDefined(accessToken, 'Access token is not set');

    const response = yield* call(() => Api.getAuthCurrent(true));

    yield* put(fetchCompleteUserSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCompleteUserFailed());
  }
}

function* updateUserRequestedSaga(
  action: ReturnType<typeof updateUserRequested>
) {
  const { userId, user } = action.payload;
  const formerUser = yield* select(selectCurrentUser);
  try {
    yield* call(() => Api.putUser(userId, user));
    yield* put(
      updateUserSucceeded({
        user,
      })
    );
    if (user.email && user.email !== formerUser?.email) {
      yield* put(authenticationActions.logoutRequested());
    }
  } catch (error) {
    yield* put(
      updateUserFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* updateCandidateRequestedSaga(
  action: ReturnType<typeof updateCandidateRequested>
) {
  const { userId, userCandidate } = action.payload;
  try {
    yield* call(() => Api.putCandidate(userId, userCandidate));
    yield* put(
      updateCandidateSucceeded({
        userId,
        userCandidate,
      })
    );
  } catch (error) {
    yield* put(
      updateCandidateFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* updateProfileRequestedSaga(
  action: ReturnType<typeof updateProfileRequested>
) {
  const { userId, userProfile } = action.payload;
  try {
    const { data } = yield* call(() => Api.putUserProfile(userId, userProfile));

    yield* put(
      updateProfileSucceeded({
        userProfile: data,
      })
    );
  } catch (error) {
    yield* put(
      updateProfileFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* readDocumentRequestedSaga(
  action: ReturnType<typeof readDocumentRequested>
) {
  const { documentName } = action.payload;
  const userId = yield* select(selectCurrentUserId);
  try {
    if (userId) {
      Api.postReadDocument({ documentName }, userId);
      yield* put(readDocumentSucceeded());
    }
    yield* fetchUserRequestedSaga();
  } catch {
    yield* put(readDocumentFailed());
  }
}

function* updateUserProfilePictureRequestedSaga(
  action: ReturnType<typeof updateUserProfilePictureRequested>
) {
  const userId = yield* select(selectCurrentUserId);
  const { profileImage } = action.payload;
  try {
    const formData = new FormData();
    formData.append('profileImage', profileImage);
    yield* call(() => Api.postProfileImage(userId, formData));
    yield* put(updateUserProfilePictureSucceeded());
  } catch {
    yield* put(updateUserProfilePictureFailed());
  }
}

function* deleteExternalCvRequestedSaga() {
  try {
    yield* call(() => Api.deleteExternalCv());
    yield* put(deleteExternalCvSucceeded());
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: `Le CV a bien été supprimé`,
      })
    );
  } catch (error) {
    yield* put(deleteExternalCvFailed());
  }
}

function* uploadExternalCvRequestedSaga(
  action: ReturnType<typeof slice.actions.uploadExternalCvRequested>
) {
  try {
    yield* call(() => Api.postExternalCv(action.payload));
    yield* put(slice.actions.uploadExternalCvSucceeded());
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: `Le CV a bien été importé`,
      })
    );
  } catch (error) {
    yield* put(
      slice.actions.uploadExternalCvFailed({
        error: 'UPLOAD_FAILED',
      })
    );
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: `Une erreur est survenue lors de l'import du CV. Veuillez réessayer.`,
      })
    );
  }
}

function* getExternalCvRequestedSaga() {
  try {
    const userId = yield* select(selectCurrentUserId);
    const response = yield* call(() => Api.getExternalCvByUser(userId));
    yield* put(getExternalCvSucceeded(response.data.url));
  } catch (error) {
    yield* put(getExternalCvFailed());
  }
}

function* loginSucceededSaga(
  action: ReturnType<typeof authenticationActions.loginSucceeded>
) {
  yield* put(setUser(action.payload.user));
}

function* logoutSucceededSaga() {
  yield* put(setUser(null));
}

export function* saga() {
  yield* takeLatest(authenticationActions.loginSucceeded, loginSucceededSaga);
  yield* takeLatest(authenticationActions.logoutSucceeded, logoutSucceededSaga);
  yield* takeLatest(fetchUserRequested, fetchUserRequestedSaga);
  yield* takeLatest(fetchCompleteUserRequested, fetchCompleteUserRequestedSaga);
  yield* takeLatest(updateUserRequested, updateUserRequestedSaga);
  yield* takeLatest(updateProfileRequested, updateProfileRequestedSaga);
  yield* takeLatest(updateCandidateRequested, updateCandidateRequestedSaga);
  yield* takeLatest(readDocumentRequested, readDocumentRequestedSaga);
  yield* takeLatest(
    updateUserProfilePictureRequested,
    updateUserProfilePictureRequestedSaga
  );
  yield* takeLatest(deleteExternalCvRequested, deleteExternalCvRequestedSaga);
  yield* takeLatest(
    slice.actions.uploadExternalCvRequested,
    uploadExternalCvRequestedSaga
  );
  yield* takeLatest(getExternalCvRequested, getExternalCvRequestedSaga);
}
