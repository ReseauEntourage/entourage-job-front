import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  LoginError,
  loginAdapter,
  logoutAdapter,
  verifyEmailTokenAdapter,
  VerifyEmailTokenErrorType,
  sendVerifyEmailAdapter,
  verifyOtpAdapter,
  VerifyOtpErrorType,
} from './authentication.adapters';

interface State {
  login: RequestState<typeof loginAdapter>;
  logout: RequestState<typeof logoutAdapter>;
  verifyEmailToken: RequestState<typeof verifyEmailTokenAdapter>;
  sendVerifyEmail: RequestState<typeof verifyEmailTokenAdapter>;
  verifyOtp: RequestState<typeof verifyOtpAdapter>;
  accessToken: string | null;
  loginError: LoginError | null;
  verifyEmailTokenError: VerifyEmailTokenErrorType | null;
  verifyOtpError: VerifyOtpErrorType | null;
}

const initialState: State = {
  logout: logoutAdapter.getInitialState(),
  login: loginAdapter.getInitialState(),
  verifyEmailToken: verifyEmailTokenAdapter.getInitialState(),
  sendVerifyEmail: verifyEmailTokenAdapter.getInitialState(),
  verifyOtp: verifyOtpAdapter.getInitialState(),
  accessToken: null,
  loginError: null,
  verifyEmailTokenError: null,
  verifyOtpError: null,
};

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    ...loginAdapter.getReducers<State>((state) => state.login, {
      loginSucceeded(state, action) {
        state.accessToken = action.payload.accessToken;
        state.loginError = null;
      },
      loginFailed(state, action) {
        state.loginError = action.payload.error;
      },
    }),
    ...logoutAdapter.getReducers<State>((state) => state.logout, {
      logoutSucceeded(state) {
        state.accessToken = null;
      },
    }),
    ...verifyEmailTokenAdapter.getReducers<State>(
      (state) => state.verifyEmailToken,
      {
        verifyEmailTokenFailed(state, action) {
          state.verifyEmailTokenError = action.payload.error;
        },
      }
    ),
    ...sendVerifyEmailAdapter.getReducers<State>(
      (state) => state.sendVerifyEmail,
      {}
    ),
    ...verifyOtpAdapter.getReducers<State>((state) => state.verifyOtp, {
      verifyOtpFailed(state, action) {
        state.verifyOtpError = action.payload.error;
      },
      verifyOtpSucceeded(state) {
        state.verifyOtpError = null;
      },
    }),
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setVerifyEmailTokenError(
      state,
      action: PayloadAction<VerifyEmailTokenErrorType | null>
    ) {
      state.verifyEmailTokenError = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
