import {
  PostAuthSendVerifyEmailParams,
  PostAuthVerifyOtpParams,
} from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

export type LoginError =
  'RATE_LIMIT' | 'INVALID_CREDENTIALS' | 'UNVERIFIED_EMAIL';

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
).withPayloads<PostAuthSendVerifyEmailParams, void>();

export enum VerifyOtpErrorType {
  EXPIRED = 'EXPIRED',
  INVALID = 'INVALID',
}

export const verifyOtpAdapter = createRequestAdapter('verifyOtp').withPayloads<
  PostAuthVerifyOtpParams,
  void,
  { error: VerifyOtpErrorType }
>();
