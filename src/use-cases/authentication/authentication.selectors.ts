import {
  fetchUserAdapter,
  loginAdapter,
  logoutAdapter,
  updateCandidateAdapter,
  updateProfileAdapter,
  updateUserAdapter,
} from './authentication.adapters';
import { RootState } from './authentication.slice';

export const fetchUserSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.authentication.fetchUser
);

export const loginSelectors = loginAdapter.getSelectors<RootState>(
  (state) => state.authentication.login
);

export const logoutSelectors = logoutAdapter.getSelectors<RootState>(
  (state) => state.authentication.logout
);

export const updateProfileSelectors =
  updateProfileAdapter.getSelectors<RootState>(
    (state) => state.authentication.updateProfile
  );

export const updateUserSelectors = updateUserAdapter.getSelectors<RootState>(
  (state) => state.authentication.updateUser
);

export const updateCandidateSelectors =
  updateCandidateAdapter.getSelectors<RootState>(
    (state) => state.authentication.updateCandidate
  );

export function selectAuthentication(state: RootState) {
  return state.authentication;
}

export function selectCurrentUser(state: RootState) {
  return state.authentication.user;
}

export function selectLoginError(state: RootState) {
  return state.authentication.loginError;
}

export function selectUserUpdateError(state: RootState) {
  return state.authentication.userUpdateError;
}

export function selectProfileUpdateError(state: RootState) {
  return state.authentication.profileUpdateError;
}
