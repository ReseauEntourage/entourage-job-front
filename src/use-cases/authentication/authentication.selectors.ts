import { UserCandidateWithUsers, UserProfile } from 'src/api/types';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import {
  getCandidateIdFromCoachOrCandidate,
  getUserCandidateFromCoachOrCandidate,
  mutateToArray,
} from 'src/utils';
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

// select candidate for the current user => doesn't work for external coach
export function selectCandidate(
  state: RootState
): UserCandidateWithUsers | null {
  if (state.authentication.user) {
    let candidate = getUserCandidateFromCoachOrCandidate(
      state.authentication.user
    );
    if (Array.isArray(candidate)) {
      [candidate] = candidate;
    }
    return candidate;
  }
  return null;
}

// select candidateId for the current user => doesn't work for external coach
export function selectCandidateId(state: RootState): string | null {
  if (state.authentication.user) {
    let candidateId = getCandidateIdFromCoachOrCandidate(
      state.authentication.user
    );
    if (Array.isArray(candidateId)) {
      [candidateId] = candidateId;
    }
    return candidateId;
  }
  return null;
}

// select department and bsuinesslines from the profile of the current user's candidate => doesn't work for external coach
export function selectCandidateProfileDefaultFiltersForDashboardOpportunities(
  state: RootState
): {
  department: Department[];
  businessLines: BusinessLineValue[];
} | null {
  let userCandidateProfile: UserProfile;
  if (state.authentication.user) {
    const candidate = getUserCandidateFromCoachOrCandidate(
      state.authentication.user
    );
    if (Array.isArray(candidate) && candidate[0]?.candidat?.userProfile) {
      userCandidateProfile = candidate[0]?.candidat?.userProfile;
    } else {
      userCandidateProfile = state.authentication.user?.userProfile;
    }
    return {
      department: mutateToArray(userCandidateProfile.department),
      businessLines: userCandidateProfile.searchBusinessLines.map(
        (businessLine) => businessLine.name
      ),
    };
  }
  return null;
}
