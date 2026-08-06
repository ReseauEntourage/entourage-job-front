// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { VerifyEmailTokenErrorType } from './authentication.adapters';
import {
  selectAccessToken,
  selectLoginError,
  selectVerifyEmailTokenError,
  selectVerifyOtpError,
} from './authentication.selectors';
import { slice } from './authentication.slice';

// `as any`: these selectors only read `state.authentication.*`, but the
// module's exported `RootState` type also requires the shared `api` reducer
// key (for the RTK-Query-backed status selectors in the same file) — not
// relevant here.
const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): any => ({
  authentication: { ...slice.getInitialState(), ...overrides },
});

describe('authentication.selectors', () => {
  describe('selectAccessToken', () => {
    it('returns the access token', () => {
      expect(selectAccessToken(buildState({ accessToken: 'token-123' }))).toBe(
        'token-123'
      );
    });

    it('returns null when there is no access token', () => {
      expect(selectAccessToken(buildState())).toBeNull();
    });
  });

  describe('selectLoginError', () => {
    it('returns the login error', () => {
      expect(selectLoginError(buildState({ loginError: 'RATE_LIMIT' }))).toBe(
        'RATE_LIMIT'
      );
    });

    it('returns null when there is no login error', () => {
      expect(selectLoginError(buildState())).toBeNull();
    });
  });

  describe('selectVerifyEmailTokenError', () => {
    it('returns the verifyEmailToken error', () => {
      expect(
        selectVerifyEmailTokenError(
          buildState({
            verifyEmailTokenError: VerifyEmailTokenErrorType.TOKEN_INVALID,
          })
        )
      ).toBe(VerifyEmailTokenErrorType.TOKEN_INVALID);
    });

    it('returns null when there is no verifyEmailToken error', () => {
      expect(selectVerifyEmailTokenError(buildState())).toBeNull();
    });
  });

  describe('selectVerifyOtpError', () => {
    it('returns the verifyOtp error', () => {
      expect(
        selectVerifyOtpError(buildState({ verifyOtpError: 'INVALID' as any }))
      ).toBe('INVALID');
    });

    it('returns null when there is no verifyOtp error', () => {
      expect(selectVerifyOtpError(buildState())).toBeNull();
    });
  });
});
