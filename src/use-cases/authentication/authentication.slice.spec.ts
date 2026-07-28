// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { slice } from './authentication.slice';

const { actions, reducer } = slice;

describe('authentication slice', () => {
  describe('loginSucceeded', () => {
    it('sets the access token and clears the login error', () => {
      const initialState = {
        ...slice.getInitialState(),
        loginError: 'INVALID_CREDENTIALS' as const,
      };

      const state = reducer(
        initialState,
        actions.loginSucceeded({ accessToken: 'token-123' })
      );

      expect(state.accessToken).toBe('token-123');
      expect(state.loginError).toBeNull();
      expect(state.login.status).toBe('SUCCEEDED');
    });
  });

  describe('loginFailed', () => {
    it('sets the login error', () => {
      const state = reducer(
        undefined,
        actions.loginFailed({ error: 'RATE_LIMIT' })
      );

      expect(state.loginError).toBe('RATE_LIMIT');
      expect(state.login.status).toBe('FAILED');
    });
  });

  describe('logoutSucceeded', () => {
    it('clears the access token', () => {
      const initialState = {
        ...slice.getInitialState(),
        accessToken: 'token-123',
      };

      const state = reducer(initialState, actions.logoutSucceeded());

      expect(state.accessToken).toBeNull();
      expect(state.logout.status).toBe('SUCCEEDED');
    });
  });

  describe('verifyEmailTokenFailed', () => {
    it('sets the verifyEmailToken error', () => {
      const state = reducer(
        undefined,
        actions.verifyEmailTokenFailed({ error: 1 })
      );

      expect(state.verifyEmailTokenError).toBe(1);
      expect(state.verifyEmailToken.status).toBe('FAILED');
    });
  });

  describe('verifyOtpFailed', () => {
    it('sets the verifyOtp error', () => {
      const state = reducer(
        undefined,
        actions.verifyOtpFailed({ error: 'INVALID' as any })
      );

      expect(state.verifyOtpError).toBe('INVALID');
      expect(state.verifyOtp.status).toBe('FAILED');
    });
  });

  describe('verifyOtpSucceeded', () => {
    it('clears the verifyOtp error', () => {
      const initialState = {
        ...slice.getInitialState(),
        verifyOtpError: 'INVALID' as any,
      };

      const state = reducer(initialState, actions.verifyOtpSucceeded());

      expect(state.verifyOtpError).toBeNull();
      expect(state.verifyOtp.status).toBe('SUCCEEDED');
    });
  });

  describe('setAccessToken', () => {
    it('sets the access token', () => {
      const state = reducer(undefined, actions.setAccessToken('token-abc'));

      expect(state.accessToken).toBe('token-abc');
    });

    it('resets the access token to null', () => {
      const initialState = {
        ...slice.getInitialState(),
        accessToken: 'token-abc',
      };

      const state = reducer(initialState, actions.setAccessToken(null));

      expect(state.accessToken).toBeNull();
    });
  });

  describe('setVerifyEmailTokenError', () => {
    it('sets the verifyEmailToken error', () => {
      const state = reducer(undefined, actions.setVerifyEmailTokenError(2));

      expect(state.verifyEmailTokenError).toBe(2);
    });

    it('resets the verifyEmailToken error to null', () => {
      const initialState = {
        ...slice.getInitialState(),
        verifyEmailTokenError: 2,
      };

      const state = reducer(
        initialState,
        actions.setVerifyEmailTokenError(null)
      );

      expect(state.verifyEmailTokenError).toBeNull();
    });
  });
});
