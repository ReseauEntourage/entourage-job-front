// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  logoutSelectors,
  selectAccessToken,
  selectLoginError,
  selectVerifyEmailTokenError,
  selectVerifyOtpError,
  sendVerifyEmailSelectors,
  verifyEmailTokenSelectors,
  verifyOtpSelectors,
} from './authentication.selectors';
import { RootState, slice } from './authentication.slice';

const buildState = (
  overrides: Partial<ReturnType<typeof slice.getInitialState>> = {}
): RootState =>
  ({
    authentication: { ...slice.getInitialState(), ...overrides },
  }) as RootState;

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
        selectVerifyEmailTokenError(buildState({ verifyEmailTokenError: 1 }))
      ).toBe(1);
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

  const adapterStatusSelectors: [
    string,
    (state: RootState) => string,
    'logout' | 'verifyEmailToken' | 'sendVerifyEmail' | 'verifyOtp',
  ][] = [
    [
      'selectLogoutStatus',
      (logoutSelectors as any).selectLogoutStatus,
      'logout',
    ],
    [
      'selectVerifyEmailTokenStatus',
      (verifyEmailTokenSelectors as any).selectVerifyEmailTokenStatus,
      'verifyEmailToken',
    ],
    [
      'selectSendVerifyEmailStatus',
      (sendVerifyEmailSelectors as any).selectSendVerifyEmailStatus,
      'sendVerifyEmail',
    ],
    [
      'selectVerifyOtpStatus',
      (verifyOtpSelectors as any).selectVerifyOtpStatus,
      'verifyOtp',
    ],
  ];

  adapterStatusSelectors.forEach(([name, selector, stateKey]) => {
    describe(name, () => {
      it(`reads the status from authentication.${stateKey}`, () => {
        const state = buildState({
          [stateKey]: { status: 'SUCCEEDED' },
        } as any);

        expect(selector(state)).toBe('SUCCEEDED');
      });
    });
  });
});
