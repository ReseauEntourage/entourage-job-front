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

export function selectAuthentication(state: RootState) {
  return state.authentication;
}

export function selectCurrentUser(state: RootState) {
  return state.authentication.user;
}

export function selectLoginError(state: RootState) {
  return state.authentication.loginError;
}
