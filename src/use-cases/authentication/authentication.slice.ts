import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import {
  LoginError,
  fetchUserAdapter,
  loginAdapter,
  logoutAdapter,
} from './authentication.adapters';

export interface State {
  fetchUser: RequestState<typeof fetchUserAdapter>;
  login: RequestState<typeof loginAdapter>;
  logout: RequestState<typeof logoutAdapter>;
  user: User | null;
  accessToken: string | null;
  loginError: LoginError | null;
}

const initialState: State = {
  fetchUser: fetchUserAdapter.getInitialState(),
  logout: logoutAdapter.getInitialState(),
  login: loginAdapter.getInitialState(),
  user: null,
  accessToken: null,
  loginError: null,
};

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    ...fetchUserAdapter.getReducers<State>((state) => state.fetchUser, {
      fetchUserSucceeded(state, action) {
        state.user = action.payload;
      },
    }),
    ...loginAdapter.getReducers<State>((state) => state.login, {
      loginSucceeded(state, action) {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      },
      loginFailed(state, action) {
        state.loginError = action.payload.error;
      },
    }),
    ...logoutAdapter.getReducers<State>((state) => state.logout, {
      logoutSucceeded(state) {
        state.user = null;
        state.accessToken = null;
      },
    }),
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
