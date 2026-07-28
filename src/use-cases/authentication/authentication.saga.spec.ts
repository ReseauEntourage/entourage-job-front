jest.mock('@/src/api');

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { STORAGE_KEYS } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import { slice } from './authentication.slice';

const { actions } = slice;
const mockedApi = getMockedApi();

function buildAxiosError(status: number, message?: string) {
  return {
    isAxiosError: true,
    response: {
      status,
      data: message ? { message } : undefined,
    },
  };
}

describe('authentication saga', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('initSaga', () => {
    it('loads the access token from localStorage when creating the store', () => {
      seedAccessToken('some-token');

      const store = createTestStore();

      expect(store.getState().authentication.accessToken).toBe('some-token');
    });

    it('leaves the access token null when nothing was seeded', () => {
      const store = createTestStore();

      expect(store.getState().authentication.accessToken).toBeNull();
    });
  });

  describe('loginRequestedSaga', () => {
    it('logs in and stores the access token on success', async () => {
      const store = createTestStore();
      mockedApi.postAuthLogin.mockResolvedValue({
        data: { token: 'token-123' },
      } as any);

      store.dispatch(
        actions.loginRequested({ email: 'User@Example.com', password: 'pw' })
      );
      await flushPromises();

      expect(store.getState().authentication.accessToken).toBe('token-123');
      expect(store.getState().authentication.login.status).toBe('SUCCEEDED');
      expect(store.getState().authentication.loginError).toBeNull();
      expect(mockedApi.postAuthLogin).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'pw',
      });
    });

    it('dispatches loginFailed with UNVERIFIED_EMAIL for a 401 unverified-email error', async () => {
      const store = createTestStore();
      mockedApi.postAuthLogin.mockRejectedValue(
        buildAxiosError(401, 'UNVERIFIED_EMAIL')
      );

      store.dispatch(
        actions.loginRequested({ email: 'user@example.com', password: 'pw' })
      );
      await flushPromises();

      expect(store.getState().authentication.login.status).toBe('FAILED');
      expect(store.getState().authentication.loginError).toBe(
        'UNVERIFIED_EMAIL'
      );
    });

    it('dispatches loginFailed with INVALID_CREDENTIALS for a generic error', async () => {
      const store = createTestStore();
      mockedApi.postAuthLogin.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.loginRequested({ email: 'user@example.com', password: 'pw' })
      );
      await flushPromises();

      expect(store.getState().authentication.login.status).toBe('FAILED');
      expect(store.getState().authentication.loginError).toBe(
        'INVALID_CREDENTIALS'
      );
    });

    // The saga's catch block has no `return`/`else` after its first `if
    // (isTooManyRequests(error))`, so a 429 error falls through to the
    // `isEmailUnverifiedError` check (false) and its `else` branch, which
    // dispatches a second `loginFailed` that overwrites the first. The final
    // state ends up INVALID_CREDENTIALS, not RATE_LIMIT, for a rate-limited
    // login. This test documents that actual (likely unintended) behavior
    // rather than the probably-intended one; see report for details.
    it('ends up with INVALID_CREDENTIALS (not RATE_LIMIT) for a 429 error, due to a fall-through in the saga', async () => {
      const store = createTestStore();
      mockedApi.postAuthLogin.mockRejectedValue(buildAxiosError(429));

      store.dispatch(
        actions.loginRequested({ email: 'user@example.com', password: 'pw' })
      );
      await flushPromises();

      expect(store.getState().authentication.login.status).toBe('FAILED');
      expect(store.getState().authentication.loginError).toBe(
        'INVALID_CREDENTIALS'
      );
    });
  });

  describe('loginSucceededSaga', () => {
    it('writes the access token to localStorage', async () => {
      const store = createTestStore();

      store.dispatch(actions.loginSucceeded({ accessToken: 'direct-token' }));
      await flushPromises();

      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe(
        'direct-token'
      );
      expect(store.getState().authentication.accessToken).toBe('direct-token');
    });
  });

  describe('logoutRequestedSaga', () => {
    it('logs out successfully', async () => {
      seedAccessToken('token-123');
      const store = createTestStore();

      store.dispatch(actions.logoutRequested());
      await flushPromises();

      expect(store.getState().authentication.logout.status).toBe('SUCCEEDED');
      expect(store.getState().authentication.accessToken).toBeNull();
    });
  });

  describe('logoutSucceededSaga', () => {
    it('removes the access token from localStorage', async () => {
      seedAccessToken('token-123');
      const store = createTestStore();
      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe('token-123');

      store.dispatch(actions.logoutSucceeded());
      await flushPromises();

      expect(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBeNull();
    });
  });

  describe('verifyEmailTokenSaga', () => {
    it('succeeds when the API call resolves', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyEmailToken.mockResolvedValue({} as any);

      store.dispatch(
        actions.verifyEmailTokenRequested({ token: 'email-token' })
      );
      await flushPromises();

      expect(store.getState().authentication.verifyEmailToken.status).toBe(
        'SUCCEEDED'
      );
    });

    it('sets ALREADY_VERIFIED when the email was already verified', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyEmailToken.mockRejectedValue(
        buildAxiosError(400, 'EMAIL_ALREADY_VERIFIED')
      );

      store.dispatch(
        actions.verifyEmailTokenRequested({ token: 'email-token' })
      );
      await flushPromises();

      expect(store.getState().authentication.verifyEmailToken.status).toBe(
        'FAILED'
      );
      expect(store.getState().authentication.verifyEmailTokenError).toBe(2); // ALREADY_VERIFIED
    });

    it('sets TOKEN_EXPIRED when the token has expired', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyEmailToken.mockRejectedValue(
        buildAxiosError(400, 'TOKEN_EXPIRED')
      );

      store.dispatch(
        actions.verifyEmailTokenRequested({ token: 'email-token' })
      );
      await flushPromises();

      expect(store.getState().authentication.verifyEmailTokenError).toBe(0); // TOKEN_EXPIRED
    });

    it('sets TOKEN_INVALID for any other error', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyEmailToken.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.verifyEmailTokenRequested({ token: 'email-token' })
      );
      await flushPromises();

      expect(store.getState().authentication.verifyEmailTokenError).toBe(1); // TOKEN_INVALID
    });
  });

  describe('sendVerifyEmailSaga', () => {
    it('succeeds when the API call resolves', async () => {
      const store = createTestStore();
      mockedApi.postAuthSendVerifyEmail.mockResolvedValue({} as any);

      store.dispatch(
        actions.sendVerifyEmailRequested({ email: 'user@example.com' })
      );
      await flushPromises();

      expect(store.getState().authentication.sendVerifyEmail.status).toBe(
        'SUCCEEDED'
      );
    });

    it('fails when the API call rejects', async () => {
      const store = createTestStore();
      mockedApi.postAuthSendVerifyEmail.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.sendVerifyEmailRequested({ email: 'user@example.com' })
      );
      await flushPromises();

      expect(store.getState().authentication.sendVerifyEmail.status).toBe(
        'FAILED'
      );
    });
  });

  describe('verifyOtpSaga', () => {
    it('logs in, succeeds, and triggers a cross-domain current-user profile fetch', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyOtp.mockResolvedValue({
        data: { token: 'otp-token' },
      } as any);
      const profile = { id: 'profile-1' } as any;
      mockedApi.getCurrentProfile.mockResolvedValue({ data: profile } as any);

      store.dispatch(
        actions.verifyOtpRequested({
          email: 'user@example.com',
          code: '123456',
        })
      );
      await flushPromises();

      expect(store.getState().authentication.accessToken).toBe('otp-token');
      expect(store.getState().authentication.login.status).toBe('SUCCEEDED');
      expect(store.getState().authentication.verifyOtp.status).toBe(
        'SUCCEEDED'
      );
      expect(store.getState().authentication.verifyOtpError).toBeNull();
      // The cross-domain fetchCurrentProfileRequested dispatched by
      // verifyOtpSaga is guarded on selectAccessToken, which is already set
      // by the time it fires (loginSucceeded is put earlier in the same
      // saga), so the guarded fetch actually runs and succeeds.
      expect(store.getState().currentUser.profile).toEqual(profile);
      expect(store.getState().currentUser.fetchCurrentProfile.status).toBe(
        'SUCCEEDED'
      );
    });

    it('sets EXPIRED when the OTP has expired', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyOtp.mockRejectedValue(
        buildAxiosError(400, 'OTP_EXPIRED')
      );

      store.dispatch(
        actions.verifyOtpRequested({
          email: 'user@example.com',
          code: '123456',
        })
      );
      await flushPromises();

      expect(store.getState().authentication.verifyOtp.status).toBe('FAILED');
      expect(store.getState().authentication.verifyOtpError).toBe('EXPIRED');
      expect(store.getState().authentication.accessToken).toBeNull();
    });

    it('sets INVALID for any other error', async () => {
      const store = createTestStore();
      mockedApi.postAuthVerifyOtp.mockRejectedValue(new Error('boom'));

      store.dispatch(
        actions.verifyOtpRequested({
          email: 'user@example.com',
          code: '123456',
        })
      );
      await flushPromises();

      expect(store.getState().authentication.verifyOtp.status).toBe('FAILED');
      expect(store.getState().authentication.verifyOtpError).toBe('INVALID');
    });
  });
});
