import { fetchUserAdapter } from './authentication.adapters';
import { RootState } from './authentication.slice';

export const fetchUserSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.authentication.fetchUser
);

export const loginSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.authentication.login
);

export const logoutSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.authentication.logout
);

export const updateProfileSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.authentication.updateProfile
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
