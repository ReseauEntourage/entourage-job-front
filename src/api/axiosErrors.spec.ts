// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  getApiErrorMessage,
  isConflictError,
  isEmailAlreadyVerifiedError,
  isEmailUnverifiedError,
  isInvalidTokenError,
  isLinkedinShareDuplicateError,
  isLinkedinTokenExpiredError,
  isMessagingDailyConversationLimitReachedError,
  isOtpExpiredError,
  isTokenExpiredError,
  isTooManyRequests,
} from './axiosErrors';

const axiosError = (status?: number, message?: unknown) => ({
  isAxiosError: true,
  response: status === undefined ? undefined : { status, data: { message } },
});

type Guard = (error: unknown) => boolean;

describe('axiosErrors', () => {
  const statusOnly: [string, Guard, number][] = [
    ['isConflictError', isConflictError, 409],
    ['isTooManyRequests', isTooManyRequests, 429],
    ['isLinkedinShareDuplicateError', isLinkedinShareDuplicateError, 422],
    ['isLinkedinTokenExpiredError', isLinkedinTokenExpiredError, 401],
  ];

  statusOnly.forEach(([name, guard, status]) => {
    describe(name, () => {
      it('matches an axios error with the expected status', () => {
        expect(guard(axiosError(status))).toBe(true);
      });
      it('rejects other statuses, missing responses and non axios errors', () => {
        expect(guard(axiosError(status + 1))).toBe(false);
        expect(guard(axiosError())).toBe(false);
        expect(guard(new Error('x'))).toBe(false);
        expect(guard(null)).toBe(false);
        expect(guard(undefined)).toBe(false);
      });
    });
  });

  const statusAndMessage: [string, Guard, number, string][] = [
    ['isEmailUnverifiedError', isEmailUnverifiedError, 401, 'UNVERIFIED_EMAIL'],
    [
      'isEmailAlreadyVerifiedError',
      isEmailAlreadyVerifiedError,
      400,
      'EMAIL_ALREADY_VERIFIED',
    ],
    [
      'isMessagingDailyConversationLimitReachedError',
      isMessagingDailyConversationLimitReachedError,
      429,
      'DAILY_CONVERSATION_LIMIT_REACHED',
    ],
    ['isTokenExpiredError', isTokenExpiredError, 400, 'TOKEN_EXPIRED'],
    ['isInvalidTokenError', isInvalidTokenError, 400, 'INVALID_TOKEN'],
    ['isOtpExpiredError', isOtpExpiredError, 400, 'OTP_EXPIRED'],
  ];

  statusAndMessage.forEach(([name, guard, status, message]) => {
    describe(name, () => {
      it('matches the expected status and message', () => {
        expect(guard(axiosError(status, message))).toBe(true);
      });
      it('rejects a different message or status', () => {
        expect(guard(axiosError(status, 'OTHER'))).toBe(false);
        expect(guard(axiosError(status + 1, message))).toBe(false);
      });
      it('rejects non axios errors', () => {
        expect(guard(new Error(message))).toBe(false);
        expect(guard({ response: { status, data: { message } } })).toBe(false);
      });
    });
  });

  describe('getApiErrorMessage', () => {
    it('returns the backend message when it is a non empty string', () => {
      expect(getApiErrorMessage(axiosError(400, 'Custom'), 'fallback')).toBe(
        'Custom'
      );
    });
    it('falls back for empty, array or missing messages', () => {
      expect(getApiErrorMessage(axiosError(400, ''), 'fallback')).toBe(
        'fallback'
      );
      expect(getApiErrorMessage(axiosError(400, ['a', 'b']), 'fallback')).toBe(
        'fallback'
      );
      expect(getApiErrorMessage(axiosError(), 'fallback')).toBe('fallback');
    });
    it('falls back for non axios errors', () => {
      expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe(
        'fallback'
      );
    });
  });
});
