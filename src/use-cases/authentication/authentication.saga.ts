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
}
