import { User } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export type LoginError =
  | 'RATE_LIMIT'
  | 'INVALID_CREDENTIALS'
  | 'UNVERIFIED_EMAIL';

// eslint-disable-next-line no-shadow
export enum VerifyEmailTokenErrorType {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  ALREADY_VERIFIED,
}

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

export const verifyEmailTokenAdapter = createRequestAdapter(
  'verifyEmailToken'
).withPayloads<
  {
    token: string;
  },
  void,
  {
    error: VerifyEmailTokenErrorType;
  }
>();

export const sendVerifyEmailAdapter = createRequestAdapter(
  'sendVerifyEmail'
).withPayloads<
  {
    token: string;
  },
  void
>();
