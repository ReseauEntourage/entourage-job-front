import { User, UserWithUserCandidate } from 'src/api/types';
import { USER_ROLES } from 'src/constants/users';
import {
  getCandidateIdFromCoachOrCandidate,
  getRelatedUser,
  getUserCandidateFromCoachOrCandidate,
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

export const fetchUserCompleteSelectors =
  fetchUserAdapter.getSelectors<RootState>(
    (state) => state.currentUser.fetchCompleteUser
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

// select candidate User for the current user => doesn't work for external coach
export function selectCandidateAsUser(state: RootState): User | null {
  const currentUser = selectAuthenticatedUser(state);

  let candidate = getUserCandidateFromCoachOrCandidate(currentUser);

  if (currentUser.role === USER_ROLES.COACH && Array.isArray(candidate)) {
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

export function selectIsComplete(state: RootState): boolean {
  return state.currentUser.complete;
}

// selects linked user if only one user is linked, otherwise sends first user of the list; if whole list needed, create new selector
export const selectLinkedUser = (
  state: RootState
): UserWithUserCandidate | null => {
  const currentUser = selectAuthenticatedUser(state);

  if (currentUser.role === USER_ROLES.COACH) {
    const candidat: UserWithUserCandidate[] | null =
      getRelatedUser(currentUser);
    if (candidat) {
      const [userToSend] = candidat;
      return userToSend;
    }
    return null;
  }
  if (currentUser.role === USER_ROLES.CANDIDATE) {
    const coach: UserWithUserCandidate[] | null = getRelatedUser(currentUser);
    if (coach) {
      const [userToSend] = coach;
      return userToSend;
    }
    return null;
  }
  return null;
};
