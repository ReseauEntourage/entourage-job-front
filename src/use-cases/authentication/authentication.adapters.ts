import { createRequestAdapter } from '../../store/utils';
import { User } from 'src/api/types';

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
