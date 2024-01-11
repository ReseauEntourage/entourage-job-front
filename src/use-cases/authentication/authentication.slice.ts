import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserWithUserCandidate } from 'src/api/types';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { RequestState, SliceRootState } from 'src/store/utils';
import { isRoleIncluded } from 'src/utils';
import {
  LoginError,
  UpdateError,
  fetchUserAdapter,
  loginAdapter,
  logoutAdapter,
  updateUserAdapter,
  updateCandidateAdapter,
  updateProfileAdapter,
} from './authentication.adapters';

export interface State {
  fetchUser: RequestState<typeof fetchUserAdapter>;
  login: RequestState<typeof loginAdapter>;
  logout: RequestState<typeof logoutAdapter>;
  user: UserWithUserCandidate | null;
  updateUser: RequestState<typeof updateUserAdapter>;
  updateCandidate: RequestState<typeof updateCandidateAdapter>;
  updateProfile: RequestState<typeof updateProfileAdapter>;
  accessToken: string | null;
  loginError: LoginError | null;
  userUpdateError: UpdateError | null; // TODO: Add error types
  profileUpdateError: UpdateError | null; // TODO: Add error types
}

const initialState: State = {
  fetchUser: fetchUserAdapter.getInitialState(),
  logout: logoutAdapter.getInitialState(),
  login: loginAdapter.getInitialState(),
  updateUser: updateUserAdapter.getInitialState(),
  updateCandidate: updateCandidateAdapter.getInitialState(),
  updateProfile: updateProfileAdapter.getInitialState(),
  user: null,
  accessToken: null,
  loginError: null,
  userUpdateError: null,
  profileUpdateError: null,
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
    ...updateUserAdapter.getReducers<State>((state) => state.updateUser, {
      updateUserSucceeded(state, action) {
        if (!state.user) return;
        state.user = { ...state.user, ...action.payload.user };
      },
      updateUserFailed(state, action) {
        state.userUpdateError = action.payload.error;
      },
    }),
    ...updateCandidateAdapter.getReducers<State>(
      (state) => state.updateCandidate,
      {
        updateCandidateSucceeded(state, action) {
          if (!state.user) return;
          if (
            isRoleIncluded(CANDIDATE_USER_ROLES, state.user.role) &&
            state.user.candidat
          ) {
            state.user.candidat = {
              ...state.user.candidat,
              ...action.payload.userCandidate,
            };
          } else if (state.user.coaches) {
            state.user = {
              ...state.user,
              coaches: state.user.coaches.map((coach) => {
                if (coach?.candidat?.id === action.payload.userId) {
                  return {
                    ...coach,
                    ...action.payload.userCandidate,
                  };
                }
                return coach;
              }),
            };
          }
        },
        updateCandidateFailed(state, action) {
          state.userUpdateError = action.payload.error;
        },
      }
    ),
    ...updateProfileAdapter.getReducers<State>((state) => state.updateProfile, {
      updateProfileSucceeded(state, action) {
        if (!state.user?.userProfile) return;
        state.user.userProfile = {
          ...state.user.userProfile,
          ...action.payload.userProfile,
        };
      },
      updateProfileFailed(state, action) {
        state.userUpdateError = action.payload.error;
      },
    }),
  },
});

export type RootState = SliceRootState<typeof slice>;
