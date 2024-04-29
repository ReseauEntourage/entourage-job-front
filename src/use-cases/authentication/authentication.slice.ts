import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  LoginError,
  loginAdapter,
  logoutAdapter,
  verifyEmailTokenAdapter,
  VerifyEmailTokenErrorType,
  sendVerifyEmailAdapter,
} from './authentication.adapters';

export interface State {
  login: RequestState<typeof loginAdapter>;
  logout: RequestState<typeof logoutAdapter>;
  verifyEmailToken: RequestState<typeof verifyEmailTokenAdapter>;
  sendVerifyEmail: RequestState<typeof verifyEmailTokenAdapter>;
  accessToken: string | null;
  loginError: LoginError | null;
  verifyEmailTokenError: VerifyEmailTokenErrorType | null;
}

const initialState: State = {
  logout: logoutAdapter.getInitialState(),
  login: loginAdapter.getInitialState(),
  verifyEmailToken: verifyEmailTokenAdapter.getInitialState(),
  sendVerifyEmail: verifyEmailTokenAdapter.getInitialState(),
  accessToken: null,
  loginError: null,
  verifyEmailTokenError: null,
};

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    ...loginAdapter.getReducers<State>((state) => state.login, {
      loginSucceeded(state, action) {
        state.accessToken = action.payload.accessToken;
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
