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
  UserStats,
} from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchCompleteUserAdapter,
  fetchCurrentAchievementsAdapter,
  fetchCurrentCompanyAdapter,
  fetchCurrentOrganizationAdapter,
  fetchCurrentProfileAdapter,
  fetchCurrentProfileCompleteAdapter,
  fetchCurrentReadDocumentsAdapter,
  fetchCurrentReferredUsersAdapter,
  fetchCurrentReferrerAdapter,
  fetchCurrentUserSocialSituationAdapter,
  fetchStaffContactAdapter,
  fetchUserAdapter,
  fetchUserStatsAdapter,
  forceOnboardingAsCompletedAdapter,
  NOT_AUTHENTICATED_USER,
  readDocumentAdapter,
  UpdateError,
  updateOnboardingStatusAdapter,
  updateProfileAdapter,
  updateSocialSituationAdapter,
  updateUserAdapter,
  updateUserCompanyAdapter,
  updateUserProfilePictureAdapter,
  uploadExternalCvAdapter,
} from './current-user.adapters';

interface State {
  fetchUser: RequestState<typeof fetchUserAdapter>;
  fetchUserStats: RequestState<typeof fetchUserStatsAdapter>;
  fetchStaffContact: RequestState<typeof fetchStaffContactAdapter>;
  fetchCompleteUser: RequestState<typeof fetchCompleteUserAdapter>;
  fetchCurrentUserSocialSituation: RequestState<
    typeof fetchCurrentUserSocialSituationAdapter
  >;
  updateUser: RequestState<typeof updateUserAdapter>;
  updateOnboardingStatus: RequestState<typeof updateOnboardingStatusAdapter>;
  forceOnboardingAsCompleted: RequestState<
    typeof forceOnboardingAsCompletedAdapter
  >;
  updateUserCompany: RequestState<typeof updateUserCompanyAdapter>;
  updateProfile: RequestState<typeof updateProfileAdapter>;
  updateSocialSituation: RequestState<typeof updateSocialSituationAdapter>;
  readDocument: RequestState<typeof readDocumentAdapter>;
  updateUserProfilePicture: RequestState<
    typeof updateUserProfilePictureAdapter
  >;
  uploadExternalCv: RequestState<typeof uploadExternalCvAdapter>;
  fetchCurrentProfile: RequestState<typeof fetchCurrentProfileAdapter>;
  fetchCurrentProfileComplete: RequestState<
    typeof fetchCurrentProfileCompleteAdapter
  >;
  fetchCurrentCompany: RequestState<typeof fetchCurrentCompanyAdapter>;
  fetchCurrentOrganization: RequestState<
    typeof fetchCurrentOrganizationAdapter
  >;
  fetchCurrentAchievements: RequestState<
    typeof fetchCurrentAchievementsAdapter
  >;
  fetchCurrentReadDocuments: RequestState<
    typeof fetchCurrentReadDocumentsAdapter
  >;
  fetchCurrentReferredUsers: RequestState<
    typeof fetchCurrentReferredUsersAdapter
  >;
  fetchCurrentReferrer: RequestState<typeof fetchCurrentReferrerAdapter>;
  user: User | null;
  stats: UserStats | null;
  complete: boolean;
  userUpdateError: UpdateError | null; // TODO: Add error types
  userCompanyUpdateError: UpdateError | null; // TODO: Add error types
  profileUpdateError: UpdateError | null; // TODO: Add error types
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
  fetchUser: fetchUserAdapter.getInitialState(),
  fetchCurrentUserSocialSituation:
    fetchCurrentUserSocialSituationAdapter.getInitialState(),
  fetchStaffContact: fetchStaffContactAdapter.getInitialState(),
  fetchCompleteUser: fetchCompleteUserAdapter.getInitialState(),
  fetchUserStats: fetchUserStatsAdapter.getInitialState(),
  updateUser: updateUserAdapter.getInitialState(),
  updateOnboardingStatus: updateOnboardingStatusAdapter.getInitialState(),
  forceOnboardingAsCompleted:
    forceOnboardingAsCompletedAdapter.getInitialState(),
  updateUserCompany: updateUserCompanyAdapter.getInitialState(),
  updateSocialSituation: updateSocialSituationAdapter.getInitialState(),
  updateProfile: updateProfileAdapter.getInitialState(),
  readDocument: readDocumentAdapter.getInitialState(),
  updateUserProfilePicture: updateUserProfilePictureAdapter.getInitialState(),
  uploadExternalCv: uploadExternalCvAdapter.getInitialState(),
  fetchCurrentProfile: fetchCurrentProfileAdapter.getInitialState(),
  fetchCurrentProfileComplete:
    fetchCurrentProfileCompleteAdapter.getInitialState(),
  fetchCurrentCompany: fetchCurrentCompanyAdapter.getInitialState(),
  fetchCurrentOrganization: fetchCurrentOrganizationAdapter.getInitialState(),
  fetchCurrentAchievements: fetchCurrentAchievementsAdapter.getInitialState(),
  fetchCurrentReadDocuments: fetchCurrentReadDocumentsAdapter.getInitialState(),
  fetchCurrentReferredUsers: fetchCurrentReferredUsersAdapter.getInitialState(),
  fetchCurrentReferrer: fetchCurrentReferrerAdapter.getInitialState(),
  user: null,
  complete: false,
  userUpdateError: null,
  userCompanyUpdateError: null,
  profileUpdateError: null,
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
    ...fetchUserAdapter.getReducers<State>((state) => state.fetchUser, {
      fetchUserSucceeded(state, action) {
        state.user = action.payload;
        state.complete = false;
      },
    }),
    ...fetchUserStatsAdapter.getReducers<State>(
      (state) => state.fetchUserStats,
      {
        fetchUserStatsSucceeded(state, action) {
          state.stats = action.payload;
        },
      }
    ),
    ...fetchCurrentUserSocialSituationAdapter.getReducers<State>(
      (state) => state.fetchCurrentUserSocialSituation,
      {
        fetchCurrentUserSocialSituationSucceeded(state, action) {
          if (state.user) {
            state.user.userSocialSituation = {
              ...state.user.userSocialSituation,
              ...action.payload,
            };
          }
        },
      }
    ),
    ...fetchStaffContactAdapter.getReducers<State>(
      (state) => state.fetchStaffContact,
      {
        fetchStaffContactSucceeded(state, action) {
          state.staffContact = action.payload;
        },
      }
    ),
    ...fetchCompleteUserAdapter.getReducers<State>(
      (state) => state.fetchCompleteUser,
      {
        fetchCompleteUserSucceeded(state, action) {
          state.user = action.payload;
          state.complete = true;
        },
      }
    ),
    ...updateUserAdapter.getReducers<State>((state) => state.updateUser, {
      updateUserSucceeded(state, action) {
        assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

        state.user = { ...state.user, ...action.payload.user };
      },
      updateUserFailed(state, action) {
        state.userUpdateError = action.payload.error;
      },
    }),
    ...updateUserCompanyAdapter.getReducers<State>(
      (state) => state.updateUserCompany,
      {
        updateUserCompanySucceeded() {},
        updateUserCompanyFailed(state, action) {
          state.userCompanyUpdateError = action.payload.error;
        },
      }
    ),
    ...updateSocialSituationAdapter.getReducers<State>(
      (state) => state.updateSocialSituation,
      {
        updateSocialSituationSucceeded() {},
        updateSocialSituationFailed() {},
      }
    ),
    ...updateProfileAdapter.getReducers<State>((state) => state.updateProfile, {
      updateProfileSucceeded(state, action) {
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
      updateProfileFailed(state, action) {
        state.userUpdateError = action.payload.error;
      },
    }),
    ...updateOnboardingStatusAdapter.getReducers<State>(
      (state) => state.updateOnboardingStatus,
      {
        updateOnboardingStatusSucceeded(state, action) {
          assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

          state.user.onboardingStatus = action.payload.onboardingStatus;
        },
      }
    ),
    ...forceOnboardingAsCompletedAdapter.getReducers<State>(
      (state) => state.forceOnboardingAsCompleted,
      {
        forceOnboardingAsCompletedSucceeded(state, action) {
          assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

          state.user.onboardingStatus = action.payload.onboardingStatus;
        },
      }
    ),
    ...readDocumentAdapter.getReducers<State>((state) => state.readDocument, {
      readDocumentSucceeded() {},
    }),
    ...updateUserProfilePictureAdapter.getReducers<State>(
      (state) => state.updateUserProfilePicture,
      {
        updateUserProfilePictureSucceeded(state) {
          if (state.profile) {
            state.profile.hasPicture = true;
          }
          if (state.profileComplete) {
            state.profileComplete.hasPicture = true;
          }
        },
      }
    ),
    ...uploadExternalCvAdapter.getReducers<State>(
      (state) => state.uploadExternalCv,
      {
        uploadExternalCvSucceeded(state) {
          if (state.profile) {
            state.profile.hasExternalCv = true;
          }
          if (state.profileComplete) {
            state.profileComplete.hasExternalCv = true;
            state.profileComplete.hasExtractedCvData = false;
          }
        },
      }
    ),
    ...fetchCurrentProfileAdapter.getReducers<State>(
      (state) => state.fetchCurrentProfile,
      {
        fetchCurrentProfileSucceeded(state, action) {
          state.profile = action.payload;
        },
      }
    ),
    ...fetchCurrentProfileCompleteAdapter.getReducers<State>(
      (state) => state.fetchCurrentProfileComplete,
      {
        fetchCurrentProfileCompleteSucceeded(state, action) {
          state.profileComplete = action.payload;
          state.complete = true;
        },
      }
    ),
    ...fetchCurrentCompanyAdapter.getReducers<State>(
      (state) => state.fetchCurrentCompany,
      {
        fetchCurrentCompanySucceeded(state, action) {
          state.company = action.payload;
        },
      }
    ),
    ...fetchCurrentOrganizationAdapter.getReducers<State>(
      (state) => state.fetchCurrentOrganization,
      {
        fetchCurrentOrganizationSucceeded(state, action) {
          state.organization = action.payload;
        },
      }
    ),
    ...fetchCurrentAchievementsAdapter.getReducers<State>(
      (state) => state.fetchCurrentAchievements,
      {
        fetchCurrentAchievementsSucceeded(state, action) {
          state.achievements = action.payload;
        },
      }
    ),
    ...fetchCurrentReadDocumentsAdapter.getReducers<State>(
      (state) => state.fetchCurrentReadDocuments,
      {
        fetchCurrentReadDocumentsSucceeded(state, action) {
          state.readDocuments = action.payload;
        },
      }
    ),
    ...fetchCurrentReferredUsersAdapter.getReducers<State>(
      (state) => state.fetchCurrentReferredUsers,
      {
        fetchCurrentReferredUsersSucceeded(state, action) {
          state.referredUsers = action.payload.referredCandidates;
        },
      }
    ),
    ...fetchCurrentReferrerAdapter.getReducers<State>(
      (state) => state.fetchCurrentReferrer,
      {
        fetchCurrentReferrerSucceeded(state, action) {
          state.referrer = action.payload;
        },
      }
    ),
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    deleteExternalCvRequested() {},
    deleteExternalCvSucceeded(state) {
      if (state.profile) {
        state.profile.hasExternalCv = false;
      }
      if (state.profileComplete) {
        state.profileComplete.hasExternalCv = false;
      }
    },
    deleteExternalCvFailed() {},
    getExternalCvRequested() {},
    getExternalCvSucceeded(state, action: PayloadAction<string>) {
      state.externalCv = action.payload;
    },
    getExternalCvFailed() {},
    generateProfileFromCVSucceeded(state) {
      if (state.profileComplete) {
        state.profileComplete.hasExtractedCvData = true;
      }
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
