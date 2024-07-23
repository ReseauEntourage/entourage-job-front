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
import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchUserAdapter,
  readDocumentAdapter,
  updateCandidateAdapter,
  updateProfileAdapter,
  updateUserAdapter,
  updateUserProfilePictureAdapter,
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

export const updateUserProfilePictureSelectors =
  updateUserProfilePictureAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateUserProfilePicture
  );

export function selectCurrentUser(state: RootState) {
  return state.currentUser.user;
}

export function selectAuthenticatedUser(state: RootState) {
  const currentUser = selectCurrentUser(state);

  assertIsDefined(currentUser, 'User is not authenticated');

  return currentUser;
}

export function selectExternalCv(state: RootState) {
  return state.currentUser.externalCv;
}

export function selectCurrentUserProfile(state: RootState) {
  const currentUser = selectAuthenticatedUser(state);
  return currentUser.userProfile;
}

export function selectCurrentUserId(state: RootState) {
  const currentUser = selectAuthenticatedUser(state);

  return currentUser.id;
}

export function selectCurrentUserProfileHelps(state: RootState) {
  const currentUser = selectAuthenticatedUser(state);

  if (isRoleIncluded(CANDIDATE_USER_ROLES, currentUser.role)) {
    return currentUser.userProfile.helpNeeds;
  }
  if (currentUser.role === USER_ROLES.COACH) {
    return currentUser.userProfile.helpOffers;
  }
}

export function selectCurrentUserProfileBusinessLines(state: RootState) {
  const currentUser = selectAuthenticatedUser(state);

  if (isRoleIncluded(CANDIDATE_USER_ROLES, currentUser.role)) {
    return currentUser.userProfile.searchBusinessLines;
  }
  if (currentUser.role === USER_ROLES.COACH) {
    return currentUser.userProfile.networkBusinessLines;
  }
}

// select candidate for the current user => doesn't work for external coach
export function selectUserCandidateWithUsers(
  state: RootState
): UserCandidateWithUsers | null {
  const currentUser = selectAuthenticatedUser(state);

  let candidate = getUserCandidateFromCoachOrCandidate(currentUser);
  if (Array.isArray(candidate)) {
    [candidate] = candidate;
  }
  return candidate;
}

// select candidate User for the current user => doesn't work for external coach
export function selectCandidateAsUser(state: RootState): User | null {
  const currentUser = selectAuthenticatedUser(state);

  let candidate = getUserCandidateFromCoachOrCandidate(currentUser);

  if (
    isRoleIncluded(COACH_USER_ROLES, currentUser.role) &&
    Array.isArray(candidate)
  ) {
    [candidate] = candidate;
    if (candidate?.candidat) {
      return candidate.candidat;
    }
    return null;
  }
  return currentUser;
}

// select candidateId for the current user => doesn't work for external coach
export function selectCandidateId(state: RootState): string | null {
  const currentUser = selectAuthenticatedUser(state);

  let candidateId = getCandidateIdFromCoachOrCandidate(currentUser);
  if (Array.isArray(candidateId)) {
    [candidateId] = candidateId;
  }
  return candidateId;
}

// select department and businesslines from the profile of the current user's candidate => doesn't work for external coach
export const selectCandidateProfileDefaultFiltersForDashboardOpportunities =
  createSelector(
    (state: RootState) => selectAuthenticatedUser(state),
    (user) => {
      let userCandidateProfile: UserProfile;
      const candidate = getUserCandidateFromCoachOrCandidate(user);
      if (Array.isArray(candidate) && candidate[0]?.candidat?.userProfile) {
        userCandidateProfile = candidate[0]?.candidat?.userProfile;
      } else {
        userCandidateProfile = user?.userProfile;
      }
      return {
        department: mutateToArray(userCandidateProfile.department),
        businessLines: userCandidateProfile.searchBusinessLines?.map(
          (businessLine) => businessLine.name
        ),
      };
    }
  );

// selects linked user if only one user is linked, otherwise sends first user of the list; if whole list needed, create new selector
export const selectLinkedUser = (
  state: RootState
): UserWithUserCandidate | null => {
  const currentUser = selectAuthenticatedUser(state);

  if (isRoleIncluded(COACH_USER_ROLES, currentUser.role)) {
    const candidat: UserWithUserCandidate[] | null =
      getRelatedUser(currentUser);
    if (candidat) {
      const [userToSend] = candidat;
      return userToSend;
    }
    return null;
  }
  if (isRoleIncluded(CANDIDATE_USER_ROLES, currentUser.role)) {
    const coach: UserWithUserCandidate[] | null = getRelatedUser(currentUser);
    if (coach) {
      const [userToSend] = coach;
      return userToSend;
    }
    return null;
  }
  return null;
};
