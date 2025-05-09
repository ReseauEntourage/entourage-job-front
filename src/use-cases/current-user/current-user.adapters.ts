import {
  User,
  UserCandidateWithUsers,
  UserProfile,
  UserWithUserCandidate,
} from 'src/api/types';
import { DocumentNameType } from 'src/constants';
import { createRequestAdapter } from 'src/store/utils';

export const fetchUserAdapter = createRequestAdapter('fetchUser').withPayloads<
  void,
  User
>();

export const fetchCompleteUserAdapter = createRequestAdapter(
  'fetchCompleteUser'
).withPayloads<void, User>();

export type UpdateError = 'UPDATE_FAILED';

export const NOT_AUTHENTICATED_USER = 'User is not authenticated';

export const updateUserAdapter = createRequestAdapter(
  'updateUser'
).withPayloads<
  {
    userId: string;
    user: Partial<UserWithUserCandidate>;
  },
  { user: Partial<UserWithUserCandidate> },
  {
    error: UpdateError;
  }
>();

export const updateProfileAdapter = createRequestAdapter(
  'updateProfile'
).withPayloads<
  {
    userId: string;
    userProfile: Partial<UserProfile>;
  },
  { userProfile: Partial<UserProfile> },
  {
    error: UpdateError;
  }
>();

export const updateCandidateAdapter = createRequestAdapter(
  'updateCandidate'
).withPayloads<
  {
    userId: string;
    userCandidate: Partial<UserCandidateWithUsers>;
  },
  {
    userId: string;
    userCandidate: Partial<UserCandidateWithUsers>;
  },
  {
    error: UpdateError;
  }
>();

export const readDocumentAdapter = createRequestAdapter(
  'readDocument'
).withPayloads<
  {
    documentName: DocumentNameType;
  },
  void
>();

export const updateUserProfilePictureAdapter = createRequestAdapter(
  'updateUserProfilePicture'
).withPayloads<
  {
    profileImage: Blob;
  },
  void
>();
