import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchCurrentUserSocialSituationAdapter,
  fetchStaffContactAdapter,
  fetchUserAdapter,
  forceOnboardingAsCompletedAdapter,
  NOT_AUTHENTICATED_USER,
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

export const selectCurrentUser = (state: RootState) => {
  return state.currentUser.user;
};

export const selectStaffContact = (state: RootState) => {
  return state.currentUser.staffContact;
};

export const selectAuthenticatedUser = (state: RootState) => {
  const currentUser = selectCurrentUser(state);

  assertIsDefined(currentUser, NOT_AUTHENTICATED_USER);

  return currentUser;
};

export const selectExternalCv = (state: RootState) => {
  return state.currentUser.externalCv;
};

export const selectCurrentUserId = (state: RootState) => {
  const currentUser = selectAuthenticatedUser(state);

  return currentUser.id;
};

export const selectCurrentUserStats = (state: RootState) => {
  return state.currentUser.stats;
};

export const selectIsComplete = (state: RootState): boolean => {
  return state.currentUser.complete;
};

export const selectCurrentUserProfile = (state: RootState) =>
  state.currentUser.profile;

export const selectCurrentUserProfileComplete = (state: RootState) =>
  state.currentUser.profileComplete;

export const selectCurrentUserCompany = (state: RootState) =>
  state.currentUser.company;

export const selectCurrentUserOrganization = (state: RootState) =>
  state.currentUser.organization;

export const selectCurrentUserAchievements = (state: RootState) =>
  state.currentUser.achievements;

export const selectCurrentUserReadDocuments = (state: RootState) =>
  state.currentUser.readDocuments;

export const selectCurrentUserReferredUsers = (state: RootState) =>
  state.currentUser.referredUsers;

export const selectCurrentUserReferrer = (state: RootState) =>
  state.currentUser.referrer;

export const selectFetchCurrentCompanyStatus = (state: RootState) =>
  state.currentUser.fetchCurrentCompany.status;

export const selectFetchCurrentProfileStatus = (state: RootState) =>
  state.currentUser.fetchCurrentProfile.status;

export const selectFetchCurrentProfileCompleteStatus = (state: RootState) =>
  state.currentUser.fetchCurrentProfileComplete.status;

export const selectFetchCurrentOrganizationStatus = (state: RootState) =>
  state.currentUser.fetchCurrentOrganization.status;

export const selectFetchCurrentAchievementsStatus = (state: RootState) =>
  state.currentUser.fetchCurrentAchievements.status;

export const selectFetchCurrentReadDocumentsStatus = (state: RootState) =>
  state.currentUser.fetchCurrentReadDocuments.status;

export const selectFetchCurrentReferredUsersStatus = (state: RootState) =>
  state.currentUser.fetchCurrentReferredUsers.status;

export const selectFetchCurrentReferrerStatus = (state: RootState) =>
  state.currentUser.fetchCurrentReferrer.status;

export const selectFetchUserStatsStatus = (state: RootState) =>
  state.currentUser.fetchUserStats.status;
