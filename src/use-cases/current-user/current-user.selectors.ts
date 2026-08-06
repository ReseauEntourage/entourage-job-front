import { FeatureKey } from '@/src/api/types';
import { ReduxRequestEvents } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import { assertIsDefined } from '@/src/utils/asserts';
import {
  currentUserApi,
  FETCH_CURRENT_ACHIEVEMENTS_FIXED_CACHE_KEY,
  FETCH_CURRENT_COMPANY_FIXED_CACHE_KEY,
  FETCH_CURRENT_ORGANIZATION_FIXED_CACHE_KEY,
  FETCH_CURRENT_PROFILE_COMPLETE_FIXED_CACHE_KEY,
  FETCH_CURRENT_PROFILE_FIXED_CACHE_KEY,
  FETCH_CURRENT_READ_DOCUMENTS_FIXED_CACHE_KEY,
  FETCH_CURRENT_REFERRED_USERS_FIXED_CACHE_KEY,
  FETCH_CURRENT_REFERRER_FIXED_CACHE_KEY,
  FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY,
  FETCH_STAFF_CONTACT_FIXED_CACHE_KEY,
  FETCH_USER_FIXED_CACHE_KEY,
  FETCH_USER_STATS_FIXED_CACHE_KEY,
  READ_DOCUMENT_FIXED_CACHE_KEY,
  UPDATE_ONBOARDING_STATUS_FIXED_CACHE_KEY,
  UPDATE_PROFILE_FIXED_CACHE_KEY,
  UPDATE_SOCIAL_SITUATION_FIXED_CACHE_KEY,
  UPDATE_USER_FIXED_CACHE_KEY,
  UPDATE_USER_PROFILE_PICTURE_FIXED_CACHE_KEY,
  UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY,
} from './current-user.api';
import {
  NOT_AUTHENTICATED_USER,
  RootState as CurrentUserSliceRootState,
} from './current-user.slice';

// `RootState` here also needs the shared `api` reducer key (for the
// `currentUserApi.endpoints.*.select()` calls below) — same reasoning as
// `store.ts`/`createTestStore.ts`.
type RootState = CurrentUserSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

type ReduxRequestStatus =
  (typeof ReduxRequestEvents)[keyof typeof ReduxRequestEvents];

/**
 * Maps an RTK Query result's status flags to the `ReduxRequestEvents` enum
 * this domain's consumers already compare against, so migrating the data
 * layer doesn't force every consumer to switch to `isLoading`/`isSuccess`.
 */
function toReduxRequestStatus(result: {
  isUninitialized: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}): ReduxRequestStatus {
  if (result.isSuccess) {
    return ReduxRequestEvents.SUCCEEDED;
  }
  if (result.isError) {
    return ReduxRequestEvents.FAILED;
  }
  if (result.isUninitialized) {
    return ReduxRequestEvents.IDLE;
  }
  return ReduxRequestEvents.REQUESTED;
}

export const fetchUserSelectors = {
  selectIsFetchUserIdle: (state: RootState) =>
    currentUserApi.endpoints.fetchUser.select(FETCH_USER_FIXED_CACHE_KEY)(state)
      .isUninitialized,
  selectIsFetchUserSucceeded: (state: RootState) =>
    currentUserApi.endpoints.fetchUser.select(FETCH_USER_FIXED_CACHE_KEY)(state)
      .isSuccess,
  selectIsFetchUserFailed: (state: RootState) =>
    currentUserApi.endpoints.fetchUser.select(FETCH_USER_FIXED_CACHE_KEY)(state)
      .isError,
};

export const fetchStaffContactSelectors = {
  selectIsFetchStaffContactIdle: (state: RootState) =>
    currentUserApi.endpoints.fetchStaffContact.select(
      FETCH_STAFF_CONTACT_FIXED_CACHE_KEY
    )(state).isUninitialized,
  selectIsFetchStaffContactRequested: (state: RootState) =>
    currentUserApi.endpoints.fetchStaffContact.select(
      FETCH_STAFF_CONTACT_FIXED_CACHE_KEY
    )(state).isLoading,
};

export const fetchCurrentUserSocialSituationSelectors = {
  selectIsFetchCurrentUserSocialSituationIdle: (state: RootState) =>
    currentUserApi.endpoints.fetchCurrentUserSocialSituation.select(
      FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY
    )(state).isUninitialized,
  selectIsFetchCurrentUserSocialSituationSucceeded: (state: RootState) =>
    currentUserApi.endpoints.fetchCurrentUserSocialSituation.select(
      FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY
    )(state).isSuccess,
  selectIsFetchCurrentUserSocialSituationFailed: (state: RootState) =>
    currentUserApi.endpoints.fetchCurrentUserSocialSituation.select(
      FETCH_CURRENT_USER_SOCIAL_SITUATION_FIXED_CACHE_KEY
    )(state).isError,
};

export const updateProfileSelectors = {
  selectUpdateProfileStatus: (state: RootState) =>
    toReduxRequestStatus(
      currentUserApi.endpoints.updateProfile.select(
        UPDATE_PROFILE_FIXED_CACHE_KEY
      )(state)
    ),
};

export const readDocumentSelectors = {
  selectReadDocumentStatus: (state: RootState) =>
    toReduxRequestStatus(
      currentUserApi.endpoints.readDocument.select(
        READ_DOCUMENT_FIXED_CACHE_KEY
      )(state)
    ),
};

export const updateUserSelectors = {
  selectUpdateUserStatus: (state: RootState) =>
    toReduxRequestStatus(
      currentUserApi.endpoints.updateUser.select(UPDATE_USER_FIXED_CACHE_KEY)(
        state
      )
    ),
};

export const selectUpdateOnboardingStatusSelectors = {
  selectUpdateOnboardingStatusStatus: (state: RootState) =>
    toReduxRequestStatus(
      currentUserApi.endpoints.updateOnboardingStatus.select(
        UPDATE_ONBOARDING_STATUS_FIXED_CACHE_KEY
      )(state)
    ),
};

export const updateUserProfilePictureSelectors = {
  selectUpdateUserProfilePictureStatus: (state: RootState) =>
    toReduxRequestStatus(
      currentUserApi.endpoints.updateUserProfilePicture.select(
        UPDATE_USER_PROFILE_PICTURE_FIXED_CACHE_KEY
      )(state)
    ),
};

export const uploadExternalCvSelectors = {
  selectIsUploadExternalCvRequested: (state: RootState) =>
    currentUserApi.endpoints.uploadExternalCv.select(
      UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY
    )(state).isLoading,
  selectIsUploadExternalCvSucceeded: (state: RootState) =>
    currentUserApi.endpoints.uploadExternalCv.select(
      UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY
    )(state).isSuccess,
  selectIsUploadExternalCvFailed: (state: RootState) =>
    currentUserApi.endpoints.uploadExternalCv.select(
      UPLOAD_EXTERNAL_CV_FIXED_CACHE_KEY
    )(state).isError,
};

export const updateSocialSituationSelectors = {
  selectIsUpdateSocialSituationSucceeded: (state: RootState) =>
    currentUserApi.endpoints.updateSocialSituation.select(
      UPDATE_SOCIAL_SITUATION_FIXED_CACHE_KEY
    )(state).isSuccess,
  selectIsUpdateSocialSituationFailed: (state: RootState) =>
    currentUserApi.endpoints.updateSocialSituation.select(
      UPDATE_SOCIAL_SITUATION_FIXED_CACHE_KEY
    )(state).isError,
};

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
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentCompany.select(
      FETCH_CURRENT_COMPANY_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentProfileStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentProfile.select(
      FETCH_CURRENT_PROFILE_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentProfileCompleteStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentProfileComplete.select(
      FETCH_CURRENT_PROFILE_COMPLETE_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentOrganizationStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentOrganization.select(
      FETCH_CURRENT_ORGANIZATION_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentAchievementsStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentAchievements.select(
      FETCH_CURRENT_ACHIEVEMENTS_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentReadDocumentsStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentReadDocuments.select(
      FETCH_CURRENT_READ_DOCUMENTS_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentReferredUsersStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentReferredUsers.select(
      FETCH_CURRENT_REFERRED_USERS_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchCurrentReferrerStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchCurrentReferrer.select(
      FETCH_CURRENT_REFERRER_FIXED_CACHE_KEY
    )(state)
  );

export const selectFetchUserStatsStatus = (state: RootState) =>
  toReduxRequestStatus(
    currentUserApi.endpoints.fetchUserStats.select(
      FETCH_USER_STATS_FIXED_CACHE_KEY
    )(state)
  );

export const selectBetaFeatures = (state: RootState): Record<string, boolean> =>
  state.currentUser.user?.betaFeatures ?? {};

export const selectHasBetaFeature =
  (key: FeatureKey) =>
  (state: RootState): boolean =>
    selectBetaFeatures(state)[key] === true;
