import { Api } from '@/src/api';
import {
  isEmailAlreadyVerifiedError,
  isEmailUnverifiedError,
  isOtpExpiredError,
  isTokenExpiredError,
} from '@/src/api/axiosErrors';
import {
  PostAuthSendVerifyEmailParams,
  PostAuthVerifyOtpParams,
} from '@/src/api/types';
import { STORAGE_KEYS } from '@/src/constants';
import { api } from '@/src/store/api/api.slice';
import { currentUserActions } from '@/src/use-cases/current-user';
import {
  LoginError,
  VerifyEmailTokenErrorType,
  VerifyOtpErrorType,
} from './authentication.adapters';
import { slice } from './authentication.slice';

const {
  loginSucceeded,
  loginFailed,
  logoutSucceeded,
  verifyEmailTokenFailed,
  verifyOtpFailed,
  verifyOtpSucceeded,
} = slice.actions;

/**
 * Fixed cache keys: each of this domain's `createRequestAdapter` fields was
 * a single global status — same reasoning as `profiles`/`events`.
 */
export const LOGIN_FIXED_CACHE_KEY = 'login';
export const LOGOUT_FIXED_CACHE_KEY = 'logout';
export const VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY = 'verifyEmailToken';
export const SEND_VERIFY_EMAIL_FIXED_CACHE_KEY = 'sendVerifyEmail';
export const VERIFY_OTP_FIXED_CACHE_KEY = 'verifyOtp';

export const authenticationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /** Translates `loginRequestedSaga` + `loginSucceededSaga`. */
    login: builder.mutation<
      { accessToken: string },
      { email: string; password: string }
    >({
      queryFn: async ({ email, password }) => {
        try {
          const response = await Api.postAuthLogin({
            email: email.toLowerCase(),
            password,
          });
          return { data: { accessToken: response.data.token } };
        } catch (error) {
          // The original saga had two independent `if` statements (not
          // `if`/`else if`): a `isTooManyRequests` 429 always fell through
          // to the unconditional second check and got overwritten, so
          // `'RATE_LIMIT'` could never actually be the final `loginError` —
          // preserved here as-is rather than silently "fixed" mid-migration.
          const loginError: LoginError = isEmailUnverifiedError(error)
            ? 'UNVERIFIED_EMAIL'
            : 'INVALID_CREDENTIALS';
          return { error: loginError };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSucceeded(data));
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        } catch (rejection) {
          dispatch(
            loginFailed({
              error: (rejection as { error: LoginError }).error,
            })
          );
        }
      },
    }),
    /** Translates `logoutRequestedSaga` + `logoutSucceededSaga`. */
    logout: builder.mutation<void, void>({
      queryFn: async () => {
        // logout api call (none today — matches the original saga)
        return { data: undefined };
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logoutSucceeded());
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        } catch {
          // No real failure path today (matches the original saga).
        }
      },
    }),
    /** Translates `verifyEmailTokenSaga`. */
    verifyEmailToken: builder.mutation<void, { token: string }>({
      queryFn: async ({ token }) => {
        try {
          await Api.postAuthVerifyEmailToken({ token });
          return { data: undefined };
        } catch (error) {
          let errorType = VerifyEmailTokenErrorType.TOKEN_INVALID;
          if (isEmailAlreadyVerifiedError(error)) {
            errorType = VerifyEmailTokenErrorType.ALREADY_VERIFIED;
          } else if (isTokenExpiredError(error)) {
            errorType = VerifyEmailTokenErrorType.TOKEN_EXPIRED;
          }
          return { error: errorType };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (rejection) {
          dispatch(
            verifyEmailTokenFailed({
              error: (rejection as { error: VerifyEmailTokenErrorType }).error,
            })
          );
        }
      },
    }),
    /** Translates `sendVerifyEmailSaga`. */
    sendVerifyEmail: builder.mutation<void, PostAuthSendVerifyEmailParams>({
      queryFn: async (params) => {
        try {
          await Api.postAuthSendVerifyEmail(params);
          return { data: undefined };
        } catch (error) {
          return { error };
        }
      },
    }),
    /** Translates `verifyOtpSaga`. */
    verifyOtp: builder.mutation<
      { accessToken: string },
      PostAuthVerifyOtpParams
    >({
      queryFn: async (params) => {
        try {
          const response = await Api.postAuthVerifyOtp(params);
          return { data: { accessToken: response.data.token } };
        } catch (error) {
          const errorType = isOtpExpiredError(error)
            ? VerifyOtpErrorType.EXPIRED
            : VerifyOtpErrorType.INVALID;
          return { error: errorType };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSucceeded(data));
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
          dispatch(verifyOtpSucceeded());
          dispatch(currentUserActions.fetchCurrentProfileRequested());
        } catch (rejection) {
          dispatch(
            verifyOtpFailed({
              error: (rejection as { error: VerifyOtpErrorType }).error,
            })
          );
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyEmailTokenMutation,
  useSendVerifyEmailMutation,
  useVerifyOtpMutation,
} = authenticationApi;
