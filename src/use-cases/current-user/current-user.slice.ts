import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserWithUserCandidate } from 'src/api/types';
import { UserRoles } from 'src/constants/users';
import { RequestState, SliceRootState } from 'src/store/utils';
import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchCompleteUserAdapter,
  fetchUserAdapter,
  NOT_AUTHENTICATED_USER,
  readDocumentAdapter,
  updateCandidateAdapter,
  UpdateError,
  updateProfileAdapter,
  updateUserAdapter,
  updateUserProfilePictureAdapter,
  uploadExternalCvAdapter,
} from './current-user.adapters';

export interface State {
  fetchUser: RequestState<typeof fetchUserAdapter>;
  fetchCompleteUser: RequestState<typeof fetchCompleteUserAdapter>;
  updateUser: RequestState<typeof updateUserAdapter>;
  updateCandidate: RequestState<typeof updateCandidateAdapter>;
  updateProfile: RequestState<typeof updateProfileAdapter>;
  readDocument: RequestState<typeof readDocumentAdapter>;
  updateUserProfilePicture: RequestState<
    typeof updateUserProfilePictureAdapter
  >;
  uploadExternalCv: RequestState<typeof uploadExternalCvAdapter>;
  user: UserWithUserCandidate | null;
  complete: boolean;
  userUpdateError: UpdateError | null; // TODO: Add error types
  profileUpdateError: UpdateError | null; // TODO: Add error types
  externalCv: string | null;
}

const initialState: State = {
  fetchUser: fetchUserAdapter.getInitialState(),
  fetchCompleteUser: fetchCompleteUserAdapter.getInitialState(),
  updateUser: updateUserAdapter.getInitialState(),
  updateCandidate: updateCandidateAdapter.getInitialState(),
  updateProfile: updateProfileAdapter.getInitialState(),
  readDocument: readDocumentAdapter.getInitialState(),
  updateUserProfilePicture: updateUserProfilePictureAdapter.getInitialState(),
  uploadExternalCv: uploadExternalCvAdapter.getInitialState(),
  user: null,
  complete: false,
  userUpdateError: null,
  profileUpdateError: null,
  externalCv: null,
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
    ...updateCandidateAdapter.getReducers<State>(
      (state) => state.updateCandidate,
      {
        updateCandidateSucceeded(state, action) {
          assertIsDefined(state.user, NOT_AUTHENTICATED_USER);

          if (state.user.role === UserRoles.CANDIDATE && state.user.candidat) {
            state.user.candidat = {
              ...state.user.candidat,
              ...action.payload.userCandidate,
            };
          } else if (state.user.coaches) {
            state.user = {
              ...state.user,
              coaches: state.user.coaches.map((coach) => {
                if (coach?.candidat?.id === action.payload.userId) {
                  return {
                    ...coach,
                    ...action.payload.userCandidate,
                  };
                }
                return coach;
              }),
            };
          }
        },
        updateCandidateFailed(state, action) {
          state.userUpdateError = action.payload.error;
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
    ...readDocumentAdapter.getReducers<State>((state) => state.readDocument, {
      readDocumentSucceeded() {},
    }),
    ...updateUserProfilePictureAdapter.getReducers<State>(
      (state) => state.updateUserProfilePicture,
      {
        updateUserProfilePictureSucceeded() {},
      }
    ),
    ...uploadExternalCvAdapter.getReducers<State>(
      (state) => state.uploadExternalCv,
      {
        uploadExternalCvSucceeded(state) {
          if (state.user && state.user.userProfile) {
            state.user.userProfile.hasExternalCv = true;
          }
        },
      }
    ),
    setUser(state, action: PayloadAction<UserWithUserCandidate | null>) {
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
  },
});

export type RootState = SliceRootState<typeof slice>;
