import { User } from 'src/api/types';
import { createRequestAdapter } from 'src/store/utils';

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

export const verifyEmailTokenAdapter = createRequestAdapter(
  'verifyEmailToken'
).withPayloads<
  {
    token: string;
  },
  void
>();
