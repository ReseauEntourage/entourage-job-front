import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceRootState } from '@/src/store/utils';
import {
  LoginError,
  VerifyEmailTokenErrorType,
  VerifyOtpErrorType,
} from './authentication.adapters';

interface State {
  accessToken: string | null;
  loginError: LoginError | null;
  verifyEmailTokenError: VerifyEmailTokenErrorType | null;
  verifyOtpError: VerifyOtpErrorType | null;
  // Deliberately a plain slice flag, not the `logout` mutation's own RTK
  // Query status: `logoutSucceeded` triggers the central
  // `api.util.resetApiState()` listener (design.md Decision 9), which would
  // otherwise wipe the `logout` mutation's own fixedCacheKey entry (and
  // thus its success flag) in the very same tick, before any consumer could
  // observe it. This flag lives outside the `api` reducer, so it survives.
  isLogoutSucceeded: boolean;
}

const initialState: State = {
  accessToken: null,
  loginError: null,
  verifyEmailTokenError: null,
  verifyOtpError: null,
  isLogoutSucceeded: false,
};

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    loginSucceeded(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.loginError = null;
    },
    loginFailed(state, action: PayloadAction<{ error: LoginError }>) {
      state.loginError = action.payload.error;
    },
    logoutSucceeded(state) {
      state.accessToken = null;
      state.isLogoutSucceeded = true;
    },
    logoutReset(state) {
      state.isLogoutSucceeded = false;
    },
    verifyEmailTokenFailed(
      state,
      action: PayloadAction<{ error: VerifyEmailTokenErrorType }>
    ) {
      state.verifyEmailTokenError = action.payload.error;
    },
    verifyOtpFailed(
      state,
      action: PayloadAction<{ error: VerifyOtpErrorType }>
    ) {
      state.verifyOtpError = action.payload.error;
    },
    verifyOtpSucceeded(state) {
      state.verifyOtpError = null;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setVerifyEmailTokenError(
      state,
      action: PayloadAction<VerifyEmailTokenErrorType | null>
    ) {
      state.verifyEmailTokenError = action.payload;
    },
    // No-op trigger actions: real handling lives in `authentication.api.ts`,
    // dispatched via `authentication.listeners.ts` in reaction to these.
    loginRequested(
      _state,
      _action: PayloadAction<{ email: string; password: string }>
    ) {},
    logoutRequested() {},
    verifyEmailTokenRequested(
      _state,
      _action: PayloadAction<{ token: string }>
    ) {},
    sendVerifyEmailRequested(
      _state,
      _action: PayloadAction<{ email?: string; token?: string }>
    ) {},
    verifyOtpRequested(
      _state,
      _action: PayloadAction<{ email: string; code: string }>
    ) {},
    autologinRequested(_state, _action: PayloadAction<{ token: string }>) {},
  },
});

export type RootState = SliceRootState<typeof slice>;
