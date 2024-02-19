import { createSelector } from '@reduxjs/toolkit';
import {
  UserCandidateWithUsers,
  UserProfile,
  UserWithUserCandidate,
} from 'src/api/types';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import {
  getCandidateIdFromCoachOrCandidate,
  getRelatedUser,
  getUserCandidateFromCoachOrCandidate,
  isRoleIncluded,
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

// select department and businesslines from the profile of the current user's candidate => doesn't work for external coach
export const selectCandidateProfileDefaultFiltersForDashboardOpportunities =
  createSelector(
    (state: RootState) => state.authentication.user,
    (user) => {
      let userCandidateProfile: UserProfile;
      if (user) {
        const candidate = getUserCandidateFromCoachOrCandidate(user);
        if (Array.isArray(candidate) && candidate[0]?.candidat?.userProfile) {
          userCandidateProfile = candidate[0]?.candidat?.userProfile;
        } else {
          userCandidateProfile = user?.userProfile;
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
  );

// selects linked user if only one user is linked, otherwise sends first user of the list; if whole list needed, create new selector
export const selectLinkedUser = (
  state: RootState
): UserWithUserCandidate | null => {
  const { user } = state.authentication;
  if (!user) return null;
  if (isRoleIncluded(COACH_USER_ROLES, user.role)) {
    const candidat: UserWithUserCandidate[] | null = getRelatedUser(user);
    if (candidat) {
      const [userToSend] = candidat;
      return userToSend;
    }
    return null;
  }
  if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
    const coach: UserWithUserCandidate[] | null = getRelatedUser(user);
    if (coach) {
      const [userToSend] = coach;
      return userToSend;
    }
    return null;
  }
  return null;
};
