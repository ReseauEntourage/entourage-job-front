import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StaffContact, User } from 'src/api/types';
import { RequestState, SliceRootState } from 'src/store/utils';
import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchCompleteUserAdapter,
  fetchStaffContactAdapter,
  fetchUserAdapter,
  NOT_AUTHENTICATED_USER,
  readDocumentAdapter,
  UpdateError,
  updateOnboardingStatusAdapter,
  updateProfileAdapter,
  updateUserAdapter,
  updateUserCompanyAdapter,
  updateUserProfilePictureAdapter,
  uploadExternalCvAdapter,
} from './current-user.adapters';

export interface State {
  fetchUser: RequestState<typeof fetchUserAdapter>;
  fetchStaffContact: RequestState<typeof fetchStaffContactAdapter>;
  fetchCompleteUser: RequestState<typeof fetchCompleteUserAdapter>;
  updateUser: RequestState<typeof updateUserAdapter>;
  updateOnboardingStatus: RequestState<typeof updateOnboardingStatusAdapter>;
  updateUserCompany: RequestState<typeof updateUserCompanyAdapter>;
  updateProfile: RequestState<typeof updateProfileAdapter>;
  readDocument: RequestState<typeof readDocumentAdapter>;
  updateUserProfilePicture: RequestState<
    typeof updateUserProfilePictureAdapter
  >;
  uploadExternalCv: RequestState<typeof uploadExternalCvAdapter>;
  user: User | null;
  complete: boolean;
  userUpdateError: UpdateError | null; // TODO: Add error types
  userCompanyUpdateError: UpdateError | null; // TODO: Add error types
  profileUpdateError: UpdateError | null; // TODO: Add error types
  externalCv: string | null;
  staffContact: StaffContact | null;
}

const initialState: State = {
  fetchUser: fetchUserAdapter.getInitialState(),
  fetchStaffContact: fetchStaffContactAdapter.getInitialState(),
  fetchCompleteUser: fetchCompleteUserAdapter.getInitialState(),
  updateUser: updateUserAdapter.getInitialState(),
  updateOnboardingStatus: updateOnboardingStatusAdapter.getInitialState(),
  updateUserCompany: updateUserCompanyAdapter.getInitialState(),
  updateProfile: updateProfileAdapter.getInitialState(),
  readDocument: readDocumentAdapter.getInitialState(),
  updateUserProfilePicture: updateUserProfilePictureAdapter.getInitialState(),
  uploadExternalCv: uploadExternalCvAdapter.getInitialState(),
  user: null,
  complete: false,
  userUpdateError: null,
  userCompanyUpdateError: null,
  profileUpdateError: null,
  externalCv: null,
  staffContact: null,
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
    ...updateProfileAdapter.getReducers<State>((state) => state.updateProfile, {
      updateProfileSucceeded(state, action) {
        assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

        state.user.userProfile = {
          ...state.user.userProfile,
          ...action.payload.userProfile,
        };
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
    ...readDocumentAdapter.getReducers<State>((state) => state.readDocument, {
      readDocumentSucceeded() {},
    }),
    ...updateUserProfilePictureAdapter.getReducers<State>(
      (state) => state.updateUserProfilePicture,
      {
        updateUserProfilePictureSucceeded(state) {
          if (state.user && state.user.userProfile) {
            state.user.userProfile.hasPicture = true;
          }
        },
      }
    ),
    ...uploadExternalCvAdapter.getReducers<State>(
      (state) => state.uploadExternalCv,
      {
        uploadExternalCvSucceeded(state) {
          if (state.user && state.user.userProfile) {
            state.user.userProfile.hasExternalCv = true;
            state.user.hasExtractedCvData = false;
          }
        },
      }
    ),
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    deleteExternalCvRequested() {},
    deleteExternalCvSucceeded(state) {
      if (state.user && state.user.userProfile) {
        state.user.userProfile.hasExternalCv = false;
      }
    },
    deleteExternalCvFailed() {},
    getExternalCvRequested() {},
    getExternalCvSucceeded(state, action: PayloadAction<string>) {
      state.externalCv = action.payload;
    },
    getExternalCvFailed() {},
    generateProfileFromCVSucceeded(state) {
      assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

      if (state.user.userProfile) {
        state.user.hasExtractedCvData = true;
      }
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
