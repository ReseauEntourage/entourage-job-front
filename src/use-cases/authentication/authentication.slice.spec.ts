// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { VerifyEmailTokenErrorType } from './authentication.adapters';
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
    });
  });

  describe('loginFailed', () => {
    it('sets the login error', () => {
      const state = reducer(
        undefined,
        actions.loginFailed({ error: 'RATE_LIMIT' })
      );

      expect(state.loginError).toBe('RATE_LIMIT');
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
    });
  });

  describe('verifyEmailTokenFailed', () => {
    it('sets the verifyEmailToken error', () => {
      const state = reducer(
        undefined,
        actions.verifyEmailTokenFailed({
          error: VerifyEmailTokenErrorType.TOKEN_INVALID,
        })
      );

      expect(state.verifyEmailTokenError).toBe(
        VerifyEmailTokenErrorType.TOKEN_INVALID
      );
    });
  });

  describe('verifyOtpFailed', () => {
    it('sets the verifyOtp error', () => {
      const state = reducer(
        undefined,
        actions.verifyOtpFailed({ error: 'INVALID' as any })
      );

      expect(state.verifyOtpError).toBe('INVALID');
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
      const state = reducer(
        undefined,
        actions.setVerifyEmailTokenError(
          VerifyEmailTokenErrorType.ALREADY_VERIFIED
        )
      );

      expect(state.verifyEmailTokenError).toBe(
        VerifyEmailTokenErrorType.ALREADY_VERIFIED
      );
    });

    it('resets the verifyEmailToken error to null', () => {
      const initialState = {
        ...slice.getInitialState(),
        verifyEmailTokenError: VerifyEmailTokenErrorType.ALREADY_VERIFIED,
      };

      const state = reducer(
        initialState,
        actions.setVerifyEmailTokenError(null)
      );

      expect(state.verifyEmailTokenError).toBeNull();
    });
  });
});
