import { call, fork, put, select, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import { isTooManyRequests } from 'src/api/axiosErrors';
import { STORAGE_KEYS } from 'src/constants';
import { selectAuthentication } from './authentication.selectors';
import { slice } from './authentication.slice';

const {
  fetchUserRequested,
  fetchUserSucceeded,
  fetchUserFailed,
  loginRequested,
  loginSucceeded,
  loginFailed,
  logoutRequested,
  logoutSucceeded,
  logoutFailed,
  setAccessToken,
  updateUserRequested,
  updateUserSucceeded,
  updateUserFailed,
  updateProfileRequested,
  updateProfileSucceeded,
  updateProfileFailed,
  updateCandidateRequested,
  updateCandidateSucceeded,
  updateCandidateFailed,
} = slice.actions;

function getIsReleaseVersionAllowed() {
  const releaseVersion = localStorage.getItem(STORAGE_KEYS.RELEASE_VERSION);
  const herokuReleaseVersion = process.env.HEROKU_RELEASE_VERSION as string;

  return releaseVersion === herokuReleaseVersion;
}

function setReleaseVersion() {
  const herokuReleaseVersion = process.env.HEROKU_RELEASE_VERSION as string;

  localStorage.setItem(STORAGE_KEYS.RELEASE_VERSION, herokuReleaseVersion);
}

function* fetchUserRequestedSaga() {
  try {
    if (!getIsReleaseVersionAllowed()) {
      setReleaseVersion();
      throw new Error('Release version is not allowed');
    }

    const { accessToken } = yield* select(selectAuthentication);

    if (!accessToken) {
      throw new Error('Access token is not set');
    }

    const response = yield* call(() => Api.getAuthCurrent());

    yield* put(fetchUserSucceeded(response.data));
  } catch {
    yield* put(fetchUserFailed());
  }
}

function* loginRequestedSaga(action: ReturnType<typeof loginRequested>) {
  const { email, password } = action.payload;

  try {
    const response = yield* call(() =>
      Api.postAuthLogin({
        email: email.toLowerCase(),
        password,
      })
    );
    yield* put(
      loginSucceeded({
        accessToken: response.data.token,
        user: response.data.user,
      })
    );
  } catch (error) {
    if (isTooManyRequests(error)) {
      yield* put(
        loginFailed({
          error: 'RATE_LIMIT',
        })
      );
    } else {
      yield* put(
        loginFailed({
          error: 'INVALID_CREDENTIALS',
        })
      );
    }
  }
}

function loginSucceededSaga(action: ReturnType<typeof loginSucceeded>) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, action.payload.accessToken);
}

function* logoutRequestedSaga() {
  try {
    // logout api call
    yield* put(logoutSucceeded());
  } catch {
    yield* put(logoutFailed());
  }
}

function logoutSucceededSaga() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

function* updateUserRequestedSaga(
  action: ReturnType<typeof updateUserRequested>
) {
  const { userId, user } = action.payload;
  try {
    yield* call(() => Api.putUser(userId, user));
    yield* put(
      updateUserSucceeded({
        user,
      })
    );
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
    yield* call(() => Api.putUserProfile(userId, userProfile));
    yield* put(
      updateProfileSucceeded({
        userProfile,
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

function* initSaga() {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;

  yield* put(setAccessToken(accessToken));
}

export function* saga() {
  yield* fork(initSaga);
  yield* takeLatest(fetchUserRequested, fetchUserRequestedSaga);
  yield* takeLatest(loginRequested, loginRequestedSaga);
  yield* takeLatest(loginSucceeded, loginSucceededSaga);
  yield* takeLatest(logoutRequested, logoutRequestedSaga);
  yield* takeLatest(logoutRequested, logoutSucceededSaga);
  yield* takeLatest(updateUserRequested, updateUserRequestedSaga);
  yield* takeLatest(updateProfileRequested, updateProfileRequestedSaga);
  yield* takeLatest(updateCandidateRequested, updateCandidateRequestedSaga);
}
