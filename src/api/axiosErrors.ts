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
