import {
  loginAdapter,
  logoutAdapter,
  sendVerifyEmailAdapter,
  verifyEmailTokenAdapter,
} from './authentication.adapters';
import { RootState } from './authentication.slice';

export const loginSelectors = loginAdapter.getSelectors<RootState>(
  (state) => state.authentication.login
);

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
