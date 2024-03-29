import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  LoginError,
  loginAdapter,
  logoutAdapter,
} from './authentication.adapters';

export interface State {
  login: RequestState<typeof loginAdapter>;
  logout: RequestState<typeof logoutAdapter>;
  accessToken: string | null;
  loginError: LoginError | null;
}

const initialState: State = {
  logout: logoutAdapter.getInitialState(),
  login: loginAdapter.getInitialState(),
  accessToken: null,
  loginError: null,
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
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
