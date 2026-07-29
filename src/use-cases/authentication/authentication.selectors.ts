import { ReduxRequestEvents } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import {
  authenticationApi,
  SEND_VERIFY_EMAIL_FIXED_CACHE_KEY,
  VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY,
  VERIFY_OTP_FIXED_CACHE_KEY,
} from './authentication.api';
import { RootState as AuthenticationSliceRootState } from './authentication.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `authenticationApi.endpoints.*.select()` calls below) — same reasoning as
// `store.ts`/`createTestStore.ts`.
type RootState = AuthenticationSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

type ReduxRequestStatus =
  (typeof ReduxRequestEvents)[keyof typeof ReduxRequestEvents];

/**
 * Maps an RTK Query result's status flags to the `ReduxRequestEvents` enum
 * this domain's consumers already compare against, so migrating the data
 * layer doesn't force every consumer to switch to `isLoading`/`isSuccess`.
 */
function toReduxRequestStatus(result: {
  isUninitialized: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}): ReduxRequestStatus {
  if (result.isSuccess) {
    return ReduxRequestEvents.SUCCEEDED;
  }
  if (result.isError) {
    return ReduxRequestEvents.FAILED;
  }
  if (result.isUninitialized) {
    return ReduxRequestEvents.IDLE;
  }
  return ReduxRequestEvents.REQUESTED;
}

export function selectAccessToken(state: RootState) {
  return state.authentication.accessToken;
}

export function selectLoginError(state: RootState) {
  return state.authentication.loginError;
}

export const logoutSelectors = {
  selectIsLogoutIdle: (state: RootState) =>
    !state.authentication.isLogoutSucceeded,
  selectIsLogoutSucceeded: (state: RootState) =>
    state.authentication.isLogoutSucceeded,
};

export const verifyEmailTokenSelectors = {
  selectVerifyEmailTokenStatus: (state: RootState) =>
    toReduxRequestStatus(
      authenticationApi.endpoints.verifyEmailToken.select(
        VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY
      )(state)
    ),
};

export const sendVerifyEmailSelectors = {
  selectSendVerifyEmailStatus: (state: RootState) =>
    toReduxRequestStatus(
      authenticationApi.endpoints.sendVerifyEmail.select(
        SEND_VERIFY_EMAIL_FIXED_CACHE_KEY
      )(state)
    ),
  selectIsSendVerifyEmailRequested: (state: RootState) =>
    authenticationApi.endpoints.sendVerifyEmail.select(
      SEND_VERIFY_EMAIL_FIXED_CACHE_KEY
    )(state).isLoading,
};

export function selectVerifyEmailTokenError(state: RootState) {
  return state.authentication.verifyEmailTokenError;
}

export const verifyOtpSelectors = {
  selectIsVerifyOtpRequested: (state: RootState) =>
    authenticationApi.endpoints.verifyOtp.select(VERIFY_OTP_FIXED_CACHE_KEY)(
      state
    ).isLoading,
};

export function selectVerifyOtpError(state: RootState) {
  return state.authentication.verifyOtpError;
}
