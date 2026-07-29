import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CurrentUserCompany,
  CurrentUserOrganization,
  CurrentUserProfile,
  CurrentUserProfileComplete,
  CurrentUserReferredUser,
  CurrentUserReferrer,
  StaffContact,
  User,
  UserAchievement,
  UserProfile,
  UserStats,
} from '@/src/api/types';
import { DocumentNameType } from '@/src/constants';
import { SliceRootState } from '@/src/store/utils';
import { assertIsDefined } from '@/src/utils/asserts';

export const NOT_AUTHENTICATED_USER = 'User is not authenticated';

interface State {
  user: User | null;
  stats: UserStats | null;
  complete: boolean;
  externalCv: string | null;
  staffContact: StaffContact | null;
  // Granular sub-entity caches (populated by /current/* routes)
  profile: CurrentUserProfile | null;
  profileComplete: CurrentUserProfileComplete | null;
  company: CurrentUserCompany;
  organization: CurrentUserOrganization;
  achievements: UserAchievement[];
  readDocuments: { documentName: string; createdAt: string }[];
  referredUsers: CurrentUserReferredUser[];
  referrer: CurrentUserReferrer | null;
}

const initialState: State = {
  user: null,
  complete: false,
  externalCv: null,
  staffContact: null,
  stats: null,
  profile: null,
  profileComplete: null,
  company: null,
  organization: null,
  achievements: [],
  readDocuments: [],
  referredUsers: [],
  referrer: null,
};

export const slice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    fetchUserSucceeded(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.complete = false;
    },
    fetchUserStatsSucceeded(state, action: PayloadAction<UserStats>) {
      state.stats = action.payload;
    },
    fetchCurrentUserSocialSituationSucceeded(
      state,
      action: PayloadAction<Partial<{ hasCompletedSurvey?: boolean }>>
    ) {
      if (state.user) {
        state.user.userSocialSituation = {
          ...state.user.userSocialSituation,
          ...action.payload,
        };
      }
    },
    fetchStaffContactSucceeded(state, action: PayloadAction<StaffContact>) {
      state.staffContact = action.payload;
    },
    updateUserSucceeded(state, action: PayloadAction<{ user: Partial<User> }>) {
      assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

      state.user = { ...state.user, ...action.payload.user };
    },
    updateProfileSucceeded(
      state,
      action: PayloadAction<{ userProfile: Partial<UserProfile> }>
    ) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload.userProfile };
      }
      if (state.profileComplete) {
        state.profileComplete = {
          ...state.profileComplete,
          ...action.payload.userProfile,
        };
      }
    },
    updateOnboardingStatusSucceeded(
      state,
      action: PayloadAction<{ onboardingStatus: User['onboardingStatus'] }>
    ) {
      assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

      state.user.onboardingStatus = action.payload.onboardingStatus;
    },
    updateUserProfilePictureSucceeded(state) {
      if (state.profile) {
        state.profile.hasPicture = true;
      }
      if (state.profileComplete) {
        state.profileComplete.hasPicture = true;
      }
    },
    uploadExternalCvSucceeded(state) {
      if (state.profile) {
        state.profile.hasExternalCv = true;
      }
      if (state.profileComplete) {
        state.profileComplete.hasExternalCv = true;
        state.profileComplete.hasExtractedCvData = false;
      }
    },
    deleteExternalCvSucceeded(state) {
      if (state.profile) {
        state.profile.hasExternalCv = false;
      }
      if (state.profileComplete) {
        state.profileComplete.hasExternalCv = false;
      }
    },
    fetchCurrentProfileSucceeded(
      state,
      action: PayloadAction<CurrentUserProfile>
    ) {
      state.profile = action.payload;
    },
    fetchCurrentProfileCompleteSucceeded(
      state,
      action: PayloadAction<CurrentUserProfileComplete>
    ) {
      state.profileComplete = action.payload;
      state.complete = true;
    },
    fetchCurrentCompanySucceeded(
      state,
      action: PayloadAction<CurrentUserCompany>
    ) {
      state.company = action.payload;
    },
    fetchCurrentOrganizationSucceeded(
      state,
      action: PayloadAction<CurrentUserOrganization>
    ) {
      state.organization = action.payload;
    },
    fetchCurrentAchievementsSucceeded(
      state,
      action: PayloadAction<UserAchievement[]>
    ) {
      state.achievements = action.payload;
    },
    fetchCurrentReadDocumentsSucceeded(
      state,
      action: PayloadAction<{ documentName: string; createdAt: string }[]>
    ) {
      state.readDocuments = action.payload;
    },
    fetchCurrentReferredUsersSucceeded(
      state,
      action: PayloadAction<{ referredCandidates: CurrentUserReferredUser[] }>
    ) {
      state.referredUsers = action.payload.referredCandidates;
    },
    fetchCurrentReferrerSucceeded(
      state,
      action: PayloadAction<CurrentUserReferrer>
    ) {
      state.referrer = action.payload;
    },
    resetCurrentUser() {
      return initialState;
    },
    profileCompleteDraftUpdated(
      state,
      action: PayloadAction<Partial<CurrentUserProfileComplete>>
    ) {
      if (state.profileComplete) {
        state.profileComplete = {
          ...state.profileComplete,
          ...action.payload,
        };
      }
    },
    // No-op trigger actions: real handling lives in `current-user.api.ts`,
    // dispatched via `current-user.listeners.ts` in reaction to these.
    fetchUserRequested(_state, _action: PayloadAction<void>) {},
    fetchUserStatsRequested(_state, _action: PayloadAction<void>) {},
    fetchStaffContactRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentUserSocialSituationRequested(
      _state,
      _action: PayloadAction<void>
    ) {},
    updateUserRequested(
      _state,
      _action: PayloadAction<{ userId: string; user: Partial<User> }>
    ) {},
    updateUserCompanyRequested(
      _state,
      _action: PayloadAction<{ companyName: string | null }>
    ) {},
    updateProfileRequested(
      _state,
      _action: PayloadAction<{
        userId: string;
        userProfile: Partial<UserProfile>;
      }>
    ) {},
    updateSocialSituationRequested(
      _state,
      _action: PayloadAction<
        Partial<{
          nationality?: string;
          accommodation?: string;
          resources?: string;
          studiesLevel?: string;
          workingExperience?: string;
          jobSearchDuration?: string;
          hasCompletedSurvey?: boolean;
        }>
      >
    ) {},
    updateOnboardingStatusRequested(
      _state,
      _action: PayloadAction<{ onboardingStatus: User['onboardingStatus'] }>
    ) {},
    readDocumentRequested(
      _state,
      _action: PayloadAction<{ documentName: DocumentNameType }>
    ) {},
    updateUserProfilePictureRequested(
      _state,
      _action: PayloadAction<{ profileImage: Blob }>
    ) {},
    deleteExternalCvRequested() {},
    uploadExternalCvRequested(
      _state,
      _action: PayloadAction<{ formData: FormData }>
    ) {},
    fetchCurrentProfileRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentProfileCompleteRequested(
      _state,
      _action: PayloadAction<void>
    ) {},
    fetchCurrentCompanyRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentOrganizationRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentAchievementsRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentReadDocumentsRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentReferredUsersRequested(_state, _action: PayloadAction<void>) {},
    fetchCurrentReferrerRequested(_state, _action: PayloadAction<void>) {},
  },
});

export type RootState = SliceRootState<typeof slice>;
