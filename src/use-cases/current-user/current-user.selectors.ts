import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchCompleteUserAdapter,
  fetchCurrentUserSocialSituationAdapter,
  fetchStaffContactAdapter,
  fetchUserAdapter,
  forceOnboardingAsCompletedAdapter,
  readDocumentAdapter,
  updateOnboardingStatusAdapter,
  updateProfileAdapter,
  updateSocialSituationAdapter,
  updateUserAdapter,
  updateUserCompanyAdapter,
  updateUserProfilePictureAdapter,
  uploadExternalCvAdapter,
} from './current-user.adapters';
import { RootState } from './current-user.slice';

export const fetchUserSelectors = fetchUserAdapter.getSelectors<RootState>(
  (state) => state.currentUser.fetchUser
);

export const fetchStaffContactSelectors =
  fetchStaffContactAdapter.getSelectors<RootState>(
    (state) => state.currentUser.fetchStaffContact
  );

export const fetchUserCompleteSelectors =
  fetchCompleteUserAdapter.getSelectors<RootState>(
    (state) => state.currentUser.fetchCompleteUser
  );

export const fetchCurrentUserSocialSituationSelectors =
  fetchCurrentUserSocialSituationAdapter.getSelectors<RootState>(
    (state) => state.currentUser.fetchCurrentUserSocialSituation
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

export const selectUpdateOnboardingStatusSelectors =
  updateOnboardingStatusAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateOnboardingStatus
  );

export const selectForceOnboardingAsCompletedSelectors =
  forceOnboardingAsCompletedAdapter.getSelectors<RootState>(
    (state) => state.currentUser.forceOnboardingAsCompleted
  );

export const updateUserCompanySelectors =
  updateUserCompanyAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateUserCompany
  );

export const updateUserProfilePictureSelectors =
  updateUserProfilePictureAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateUserProfilePicture
  );

export const uploadExternalCvSelectors =
  uploadExternalCvAdapter.getSelectors<RootState>(
    (state) => state.currentUser.uploadExternalCv
  );

export const updateSocialSituationSelectors =
  updateSocialSituationAdapter.getSelectors<RootState>(
    (state) => state.currentUser.updateSocialSituation
  );

export function selectCurrentUser(state: RootState) {
  return state.currentUser.user;
}

export function selectStaffContact(state: RootState) {
  return state.currentUser.staffContact;
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

export function selectIsComplete(state: RootState): boolean {
  return state.currentUser.complete;
}
