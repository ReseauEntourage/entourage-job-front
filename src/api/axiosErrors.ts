import { AxiosError } from 'axios';

function isAxiosError(error: any): error is AxiosError {
  return error?.isAxiosError === true;
}

export function isConflictError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 409;
}

export function isTooManyRequests(error: unknown) {
  return isAxiosError(error) && error.response?.status === 429;
}

export function isEmailUnverifiedError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    (error.response?.data as { message?: string })?.message ===
      'UNVERIFIED_EMAIL'
  );
}

export function isEmailAlreadyVerifiedError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 400 &&
    (error.response?.data as { message?: string })?.message ===
      'EMAIL_ALREADY_VERIFIED'
  );
}

export function isMessagingDailyConversationLimitReachedError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 429 &&
    (error.response?.data as { message?: string })?.message ===
      'DAILY_CONVERSATION_LIMIT_REACHED'
  );
}

export function isTokenExpiredError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 400 &&
    (error.response?.data as { message?: string })?.message === 'TOKEN_EXPIRED'
  );
}

export function isInvalidTokenError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 400 &&
    (error.response?.data as { message?: string })?.message === 'INVALID_TOKEN'
  );
}

export function isLinkedinShareDuplicateError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 422;
}

export function isOtpExpiredError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 400 &&
    (error.response?.data as { message?: string })?.message === 'OTP_EXPIRED'
  );
}

/**
 * Extracts a user-facing message from an API error, when the backend sent
 * one as a plain string (e.g. `UnauthorizedException('Some message')`).
 * Falls back to `fallbackMessage` when there is none (network error,
 * validation error with an array of messages, unrecognized error shape…).
 */
export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!isAxiosError(error)) {
    return fallbackMessage;
  }
  const message = (error.response?.data as { message?: unknown })?.message;
  return typeof message === 'string' && message.length > 0
    ? message
    : fallbackMessage;
}
