import {
  logoutAdapter,
  sendVerifyEmailAdapter,
  verifyEmailTokenAdapter,
  verifyOtpAdapter,
} from './authentication.adapters';
import { RootState } from './authentication.slice';

export const logoutSelectors = logoutAdapter.getSelectors<RootState>(
  (state) => state.authentication.logout
);

export function selectAccessToken(state: RootState) {
  return state.authentication.accessToken;
}

export function selectLoginError(state: RootState) {
  return state.authentication.loginError;
}

export const verifyEmailTokenSelectors =
  verifyEmailTokenAdapter.getSelectors<RootState>(
    (state) => state.authentication.verifyEmailToken
  );

export const sendVerifyEmailSelectors =
  sendVerifyEmailAdapter.getSelectors<RootState>(
    (state) => state.authentication.sendVerifyEmail
  );

export function selectVerifyEmailTokenError(state: RootState) {
  return state.authentication.verifyEmailTokenError;
}

export const verifyOtpSelectors = verifyOtpAdapter.getSelectors<RootState>(
  (state) => state.authentication.verifyOtp
);

export function selectVerifyOtpError(state: RootState) {
  return state.authentication.verifyOtpError;
}
