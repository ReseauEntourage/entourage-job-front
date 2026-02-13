import { call, fork, put, takeLatest } from 'typed-redux-saga';
import { Api } from 'src/api';
import {
  isEmailAlreadyVerifiedError,
  isEmailUnverifiedError,
  isTokenExpiredError,
  isTooManyRequests,
} from 'src/api/axiosErrors';
import { STORAGE_KEYS } from 'src/constants';
import { VerifyEmailTokenErrorType } from './authentication.adapters';
import { slice } from './authentication.slice';

const {
  loginRequested,
  loginSucceeded,
  loginFailed,
  logoutRequested,
  logoutSucceeded,
  logoutFailed,
  setAccessToken,
  verifyEmailTokenFailed,
  verifyEmailTokenRequested,
  verifyEmailTokenSucceeded,
  sendVerifyEmailRequested,
  sendVerifyEmailSucceeded,
  sendVerifyEmailFailed,
} = slice.actions;

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
    }
    if (isEmailUnverifiedError(error)) {
      yield* put(
        loginFailed({
          error: 'UNVERIFIED_EMAIL',
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
  localStorage.setItem(
    STORAGE_KEYS.ONBOARDING_COMPLETION_STATUS,
    action.payload.user.onboardingStatus
  );
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

function* verifyEmailTokenSaga(
  action: ReturnType<typeof verifyEmailTokenRequested>
) {
  try {
    yield* call(() => Api.postAuthVerifyEmailToken(action.payload));
    yield* put(verifyEmailTokenSucceeded());
  } catch (error) {
    if (isEmailAlreadyVerifiedError(error)) {
      yield* put(
        verifyEmailTokenFailed({
          error: VerifyEmailTokenErrorType.ALREADY_VERIFIED,
        })
      );
    } else if (isTokenExpiredError(error)) {
      yield* put(
        verifyEmailTokenFailed({
          error: VerifyEmailTokenErrorType.TOKEN_EXPIRED,
        })
      );
    } else {
      yield* put(
        verifyEmailTokenFailed({
          error: VerifyEmailTokenErrorType.TOKEN_INVALID,
        })
      );
    }
  }
}

function* sendVerifyEmailSaga(
  action: ReturnType<typeof sendVerifyEmailRequested>
) {
  try {
    yield* call(() => Api.postAuthSendVerifyEmail(action.payload));
    yield* put(sendVerifyEmailSucceeded());
  } catch {
    yield* put(sendVerifyEmailFailed());
  }
}

function* initSaga() {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;

  yield* put(setAccessToken(accessToken));
}

export function* saga() {
  yield* fork(initSaga);
  yield* takeLatest(loginRequested, loginRequestedSaga);
  yield* takeLatest(loginSucceeded, loginSucceededSaga);
  yield* takeLatest(logoutRequested, logoutRequestedSaga);
  yield* takeLatest(logoutSucceeded, logoutSucceededSaga);
  yield* takeLatest(verifyEmailTokenRequested, verifyEmailTokenSaga);
  yield* takeLatest(sendVerifyEmailRequested, sendVerifyEmailSaga);
}
