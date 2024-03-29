import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserWithUserCandidate } from 'src/api/types';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { RequestState, SliceRootState } from 'src/store/utils';
import { isRoleIncluded } from 'src/utils';
import { assertIsDefined } from 'src/utils/asserts';
import {
  fetchUserAdapter,
  NOT_AUTHENTICATED_USER,
  readDocumentAdapter,
  updateCandidateAdapter,
  UpdateError,
  updateProfileAdapter,
  updateUserAdapter,
  updateUserProfilePictureAdapter,
} from './current-user.adapters';

export interface State {
  fetchUser: RequestState<typeof fetchUserAdapter>;
  updateUser: RequestState<typeof updateUserAdapter>;
  updateCandidate: RequestState<typeof updateCandidateAdapter>;
  updateProfile: RequestState<typeof updateProfileAdapter>;
  readDocument: RequestState<typeof readDocumentAdapter>;
  updateUserProfilePicture: RequestState<
    typeof updateUserProfilePictureAdapter
  >;
  user: UserWithUserCandidate | null;
  userUpdateError: UpdateError | null; // TODO: Add error types
  profileUpdateError: UpdateError | null; // TODO: Add error types
}

const initialState: State = {
  fetchUser: fetchUserAdapter.getInitialState(),
  updateUser: updateUserAdapter.getInitialState(),
  updateCandidate: updateCandidateAdapter.getInitialState(),
  updateProfile: updateProfileAdapter.getInitialState(),
  readDocument: readDocumentAdapter.getInitialState(),
  updateUserProfilePicture: updateUserProfilePictureAdapter.getInitialState(),
  user: null,
  userUpdateError: null,
  profileUpdateError: null,
};

export const slice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    ...fetchUserAdapter.getReducers<State>((state) => state.fetchUser, {
      fetchUserSucceeded(state, action) {
        state.user = action.payload;
      },
    }),
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

          if (
            isRoleIncluded(CANDIDATE_USER_ROLES, state.user.role) &&
            state.user.candidat
          ) {
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
    setUser(state, action: PayloadAction<UserWithUserCandidate | null>) {
      state.user = action.payload;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
