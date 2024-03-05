import { createSelector } from '@reduxjs/toolkit';
import {
  User,
  UserCandidateWithUsers,
  UserProfile,
  UserWithUserCandidate,
} from 'src/api/types';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import {
  getCandidateIdFromCoachOrCandidate,
  getRelatedUser,
  getUserCandidateFromCoachOrCandidate,
  isRoleIncluded,
  mutateToArray,
} from 'src/utils';
import {
  fetchUserAdapter,
  readDocumentAdapter,
  updateCandidateAdapter,
  updateProfileAdapter,
  updateUserAdapter,
} from './current-user.adapters';
import { RootState } from './current-user.slice';

export const fetchUserSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.currentUser.fetchUser
);

export const updateProfileSelectors =
  updateProfileAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateProfile
  );

export const readDocumentSelectors =
  readDocumentAdapter.getSelectors<RootState>(
    (state) => state.currentUser.readDocument
  );

export const updateUserSelectors = updateUserAdapter.getSelectors<RootState>(
  (state) => state.currentUser.updateUser
);

export const updateCandidateSelectors =
  updateCandidateAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateCandidate
  );

export function selectCurrentUser(state: RootState) {
  return state.currentUser.user;
}

export function selectCurrentUserId(state: RootState) {
  if (!state.currentUser.user) {
    throw new Error('No current user id');
  }
  return state.currentUser.user.id;
}

export function selectCurrentUserProfileHelps(state: RootState) {
  if (state.currentUser.user) {
    if (isRoleIncluded(CANDIDATE_USER_ROLES, state.currentUser.user.role)) {
      return state.currentUser.user.userProfile.helpNeeds;
    }
    if (state.currentUser.user.role === USER_ROLES.COACH) {
      return state.currentUser.user.userProfile.helpOffers;
    }
  }
  return null;
}

export function selectCurrentUserProfileBusinessLines(state: RootState) {
  if (state.currentUser.user) {
    if (isRoleIncluded(CANDIDATE_USER_ROLES, state.currentUser.user.role)) {
      return state.currentUser.user.userProfile.searchBusinessLines;
    }
    if (state.currentUser.user.role === USER_ROLES.COACH) {
      return state.currentUser.user.userProfile.networkBusinessLines;
    }
  }
  return null;
}

// select candidate for the current user => doesn't work for external coach
export function selectUserCandidateWithUsers(
  state: RootState
): UserCandidateWithUsers | null {
  if (state.currentUser.user) {
    let candidate = getUserCandidateFromCoachOrCandidate(
      state.currentUser.user
    );
    if (Array.isArray(candidate)) {
      [candidate] = candidate;
    }
    return candidate;
  }
  return null;
}

// select candidate User for the current user => doesn't work for external coach
export function selectCandidateAsUser(state: RootState): User | null {
  const { user } = state.currentUser;
  if (user) {
    let candidate = getUserCandidateFromCoachOrCandidate(user);
    if (
      isRoleIncluded(COACH_USER_ROLES, user.role) &&
      Array.isArray(candidate)
    ) {
      [candidate] = candidate;
      if (candidate?.candidat) {
        return candidate.candidat;
      }
    }
    return user;
  }
  return null;
}

// select candidateId for the current user => doesn't work for external coach
export function selectCandidateId(state: RootState): string | null {
  if (state.currentUser.user) {
    let candidateId = getCandidateIdFromCoachOrCandidate(
      state.currentUser.user
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
    (state: RootState) => state.currentUser.user,
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
  const { user } = state.currentUser;
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
