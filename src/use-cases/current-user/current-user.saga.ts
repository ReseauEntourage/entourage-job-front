import { call, put, select, takeLatest } from 'typed-redux-saga';
import { STORAGE_KEYS } from '@/src/constants';
import { OnboardingStatus } from '@/src/constants/onboarding';
import { notificationsActions } from '../notifications';
import { Api } from 'src/api';
import {
  authenticationActions,
  selectAccessToken,
} from 'src/use-cases/authentication';
import { assertIsDefined } from 'src/utils/asserts';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from './current-user.selectors';
import { slice } from './current-user.slice';
import { currentUserActions } from '.';

const {
  fetchUserRequested,
  setUser,
  fetchUserSucceeded,
  fetchUserFailed,
  updateUserRequested,
  updateUserCompanyRequested,
  fetchCompleteUserRequested,
  fetchCompleteUserSucceeded,
  fetchCompleteUserFailed,
  updateUserSucceeded,
  updateUserFailed,
  updateUserCompanySucceeded,
  updateUserCompanyFailed,
  updateProfileRequested,
  updateProfileSucceeded,
  updateProfileFailed,
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
  uploadExternalCvRequested,
  uploadExternalCvSucceeded,
  uploadExternalCvFailed,
  fetchStaffContactRequested,
  fetchStaffContactSucceeded,
  fetchStaffContactFailed,
  updateOnboardingStatusRequested,
  updateOnboardingStatusSucceeded,
  updateOnboardingStatusFailed,
  forceOnboardingAsCompletedRequested,
  forceOnboardingAsCompletedSucceeded,
  forceOnboardingAsCompletedFailed,
} = slice.actions;

function* fetchUserRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);

    assertIsDefined(accessToken, 'Access token is not set');

    const response = yield* call(() => Api.getAuthCurrent(false));

    yield* put(fetchUserSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchUserFailed());
  }
}

function fetchUserSucceededSaga(action: ReturnType<typeof fetchUserSucceeded>) {
  const { onboardingStatus } = action.payload;
  try {
    localStorage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETION_STATUS,
      onboardingStatus
    );
  } catch (e) {
    console.error('Failed to store onboarding status in localStorage', e);
  }
}

function* fetchStaffContactRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);

    assertIsDefined(accessToken, 'Access token is not set');
    const response = yield* call(() => Api.getStaffContactInfo());

    yield* put(fetchStaffContactSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchStaffContactFailed());
  }
}

function* fetchCompleteUserRequestedSaga() {
  try {
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
  } catch {
    yield* put(
      updateUserFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* updateOnboardingStatusRequestedSaga(
  action: ReturnType<typeof updateOnboardingStatusRequested>
) {
  const { onboardingStatus } = action.payload;
  try {
    const userId = yield* select(selectCurrentUserId);
    yield* call(() => Api.putUser(userId, { onboardingStatus }));
    yield* put(
      updateOnboardingStatusSucceeded({
        onboardingStatus,
      })
    );
  } catch {
    yield* put(
      updateOnboardingStatusFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* forceOnboardingAsCompletedRequestedSaga() {
  try {
    const userId = yield* select(selectCurrentUserId);
    const { data } = yield* call(() =>
      Api.putUser(userId, { onboardingStatus: OnboardingStatus.COMPLETED })
    );
    yield* put(
      forceOnboardingAsCompletedSucceeded({
        onboardingStatus: data.onboardingStatus,
      })
    );
  } catch {
    yield* put(
      forceOnboardingAsCompletedFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* updateUserCompanyRequestedSaga(
  action: ReturnType<typeof updateUserCompanyRequested>
) {
  const { companyName } = action.payload;
  try {
    yield* call(() => Api.putUserCompany(companyName));
    yield* put(updateUserCompanySucceeded());
    yield* fetchUserRequestedSaga();
  } catch {
    yield* put(
      updateUserCompanyFailed({
        error: 'UPDATE_FAILED',
      })
    );
    yield* put(
      notificationsActions.addNotification({
        type: 'danger',
        message: `Une erreur est survenue lors de la mise à jour de l'entreprise. Veuillez réessayer.`,
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
  } catch {
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
  const { profileImage } = action.payload;
  try {
    const formData = new FormData();
    formData.append('profileImage', profileImage);
    yield* call(() => Api.postProfileImage(formData));
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
  } catch {
    yield* put(deleteExternalCvFailed());
  }
}

function* uploadExternalCvRequestedSaga(
  action: ReturnType<typeof uploadExternalCvRequested>
) {
  const formData = action.payload.formData;
  try {
    yield* call(() => Api.postExternalCv(formData));
    yield* put(uploadExternalCvSucceeded());
    yield* put(
      notificationsActions.addNotification({
        type: 'success',
        message: 'Votre entreprise a été mise à jour avec succès',
      })
    );
  } catch {
    yield* put(
      uploadExternalCvFailed({
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
  } catch {
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
  yield* takeLatest(fetchUserSucceeded, fetchUserSucceededSaga);
  yield* takeLatest(fetchStaffContactRequested, fetchStaffContactRequestedSaga);
  yield* takeLatest(fetchCompleteUserRequested, fetchCompleteUserRequestedSaga);
  yield* takeLatest(updateUserRequested, updateUserRequestedSaga);
  yield* takeLatest(
    updateOnboardingStatusRequested,
    updateOnboardingStatusRequestedSaga
  );
  yield* takeLatest(
    forceOnboardingAsCompletedRequested,
    forceOnboardingAsCompletedRequestedSaga
  );
  yield* takeLatest(updateProfileRequested, updateProfileRequestedSaga);
  yield* takeLatest(readDocumentRequested, readDocumentRequestedSaga);
  yield* takeLatest(
    updateUserProfilePictureRequested,
    updateUserProfilePictureRequestedSaga
  );
  yield* takeLatest(deleteExternalCvRequested, deleteExternalCvRequestedSaga);
  yield* takeLatest(uploadExternalCvRequested, uploadExternalCvRequestedSaga);
  yield* takeLatest(getExternalCvRequested, getExternalCvRequestedSaga);
  yield* takeLatest(updateUserCompanyRequested, updateUserCompanyRequestedSaga);
}
