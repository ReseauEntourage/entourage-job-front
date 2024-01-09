import {
  User,
  UserCandidateWithUsers,
  UserProfile,
  UserWithUserCandidate,
} from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export const fetchUserAdapter = createRequestAdapter('fetchUser').withPayloads<
  void,
  User
>();

export type LoginError = 'RATE_LIMIT' | 'INVALID_CREDENTIALS';

export const loginAdapter = createRequestAdapter('login').withPayloads<
  {
    email: string;
    password: string;
  },
  {
    user: User;
    accessToken: string;
  },
  {
    error: LoginError;
  }
>();

export const logoutAdapter = createRequestAdapter('logout').withPayloads();

export type UpdateError = 'UPDATE_FAILED';

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
