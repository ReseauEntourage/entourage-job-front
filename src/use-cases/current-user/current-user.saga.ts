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
  selectCurrentUserProfileComplete,
} from './current-user.selectors';
import { slice } from './current-user.slice';

const {
  fetchUserRequested,
  resetCurrentUser,
  fetchUserSucceeded,
  fetchUserFailed,
  fetchCurrentUserSocialSituationRequested,
  fetchCurrentUserSocialSituationSucceeded,
  fetchCurrentUserSocialSituationFailed,
  updateUserRequested,
  updateUserCompanyRequested,
  fetchCompleteUserRequested,
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
  updateSocialSituationRequested,
  updateSocialSituationSucceeded,
  updateSocialSituationFailed,
  fetchUserStatsRequested,
  fetchUserStatsSucceeded,
  fetchUserStatsFailed,
  fetchCurrentProfileRequested,
  fetchCurrentProfileSucceeded,
  fetchCurrentProfileFailed,
  fetchCurrentProfileCompleteRequested,
  fetchCurrentProfileCompleteSucceeded,
  fetchCurrentProfileCompleteFailed,
  fetchCurrentCompanyRequested,
  fetchCurrentCompanySucceeded,
  fetchCurrentCompanyFailed,
  fetchCurrentOrganizationRequested,
  fetchCurrentOrganizationSucceeded,
  fetchCurrentOrganizationFailed,
  fetchCurrentAchievementsRequested,
  fetchCurrentAchievementsSucceeded,
  fetchCurrentAchievementsFailed,
  fetchCurrentReadDocumentsRequested,
  fetchCurrentReadDocumentsSucceeded,
  fetchCurrentReadDocumentsFailed,
  fetchCurrentReferredUsersRequested,
  fetchCurrentReferredUsersSucceeded,
  fetchCurrentReferredUsersFailed,
  fetchCurrentReferrerRequested,
  fetchCurrentReferrerSucceeded,
  fetchCurrentReferrerFailed,
} = slice.actions;

function* fetchUserRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);

    if (!accessToken) {
      yield* put(fetchUserFailed());
      return;
    }

    const response = yield* call(() => Api.getCurrentIdentity());

    yield* put(fetchUserSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchUserFailed());
  }
}

function* fetchUserStatsRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);

    if (!accessToken) {
      yield* put(fetchUserStatsFailed());
      return;
    }

    const response = yield* call(() => Api.getCurrentStats());

    yield* put(fetchUserStatsSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchUserStatsFailed());
  }
}

function* fetchCurrentUserSocialSituationRequestedSaga() {
  try {
    const response = yield* call(() => Api.getUserSocialSituation());
    yield* put(fetchCurrentUserSocialSituationSucceeded(response.data));
  } catch {
    yield* put(fetchCurrentUserSocialSituationFailed());
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

    if (!accessToken) {
      yield* put(fetchStaffContactFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentStaffContact());

    yield* put(fetchStaffContactSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchStaffContactFailed());
  }
}

function* fetchCompleteUserRequestedSaga() {
  yield* put(fetchCurrentProfileCompleteRequested());
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

    const profileComplete = yield* select(selectCurrentUserProfileComplete);
    if (profileComplete) {
      yield* put(fetchCurrentProfileCompleteRequested());
    }
  } catch {
    yield* put(
      updateProfileFailed({
        error: 'UPDATE_FAILED',
      })
    );
  }
}

function* updateSocialSituationRequestedSaga(
  action: ReturnType<typeof updateSocialSituationRequested>
) {
  const userId = yield* select(selectCurrentUserId);
  const socialSituation = action.payload;

  assertIsDefined(userId, 'User ID is not defined');
  try {
    yield* call(() =>
      Api.updateUserSocialSituation(userId, {
        hasCompletedSurvey: true,
        ...socialSituation,
      })
    );
    yield* put(updateSocialSituationSucceeded({}));
    yield* fetchUserRequestedSaga();
  } catch {
    yield* put(
      updateSocialSituationFailed({
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
        message: 'Votre CV a bien été importé',
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

function* fetchCurrentProfileRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentProfileFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentProfile());
    yield* put(fetchCurrentProfileSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentProfileFailed());
  }
}

function* fetchCurrentProfileCompleteRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentProfileCompleteFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentProfileComplete());
    yield* put(fetchCurrentProfileCompleteSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentProfileCompleteFailed());
  }
}

function* fetchCurrentCompanyRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentCompanyFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentCompany());
    yield* put(fetchCurrentCompanySucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentCompanyFailed());
  }
}

function* fetchCurrentOrganizationRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentOrganizationFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentOrganization());
    yield* put(fetchCurrentOrganizationSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentOrganizationFailed());
  }
}

function* fetchCurrentAchievementsRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentAchievementsFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentAchievements());
    yield* put(fetchCurrentAchievementsSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentAchievementsFailed());
  }
}

function* fetchCurrentReadDocumentsRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentReadDocumentsFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentReadDocuments());
    yield* put(fetchCurrentReadDocumentsSucceeded(response.data.readDocuments));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentReadDocumentsFailed());
  }
}

function* fetchCurrentReferredUsersRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentReferredUsersFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentReferredUsers());
    yield* put(fetchCurrentReferredUsersSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentReferredUsersFailed());
  }
}

function* fetchCurrentReferrerRequestedSaga() {
  try {
    const accessToken = yield* select(selectAccessToken);
    if (!accessToken) {
      yield* put(fetchCurrentReferrerFailed());
      return;
    }
    const response = yield* call(() => Api.getCurrentReferrer());
    yield* put(fetchCurrentReferrerSucceeded(response.data));
  } catch (e) {
    console.error(e);
    yield* put(fetchCurrentReferrerFailed());
  }
}

function* loginSucceededSaga() {
  yield* put(fetchUserRequested());
}

function* logoutSucceededSaga() {
  yield* put(resetCurrentUser());
}

export function* saga() {
  yield* takeLatest(authenticationActions.loginSucceeded, loginSucceededSaga);
  yield* takeLatest(authenticationActions.logoutSucceeded, logoutSucceededSaga);
  yield* takeLatest(fetchUserRequested, fetchUserRequestedSaga);
  yield* takeLatest(fetchUserSucceeded, fetchUserSucceededSaga);
  yield* takeLatest(fetchUserStatsRequested, fetchUserStatsRequestedSaga);
  yield* takeLatest(
    fetchCurrentUserSocialSituationRequested,
    fetchCurrentUserSocialSituationRequestedSaga
  );
  yield* takeLatest(fetchStaffContactRequested, fetchStaffContactRequestedSaga);
  yield* takeLatest(fetchCompleteUserRequested, fetchCompleteUserRequestedSaga);
  yield* takeLatest(updateUserRequested, updateUserRequestedSaga);
  yield* takeLatest(
    updateSocialSituationRequested,
    updateSocialSituationRequestedSaga
  );
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
  yield* takeLatest(
    fetchCurrentProfileRequested,
    fetchCurrentProfileRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentProfileCompleteRequested,
    fetchCurrentProfileCompleteRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentCompanyRequested,
    fetchCurrentCompanyRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentOrganizationRequested,
    fetchCurrentOrganizationRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentAchievementsRequested,
    fetchCurrentAchievementsRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentReadDocumentsRequested,
    fetchCurrentReadDocumentsRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentReferredUsersRequested,
    fetchCurrentReferredUsersRequestedSaga
  );
  yield* takeLatest(
    fetchCurrentReferrerRequested,
    fetchCurrentReferrerRequestedSaga
  );
}
