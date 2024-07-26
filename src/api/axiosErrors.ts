/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosResponse } from 'axios';

function isAxiosError(error: any): error is AxiosError {
  return error?.isAxiosError === true;
}

export function isBadRequestError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 400;
}

export function isUnauthorizedError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 401;
}

export function isForbiddenError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 403;
}

export function isNotFoundError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 404;
}

export function isConflictError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 409;
}

export function isUnprocessableEntityError(error: unknown) {
  return isAxiosError(error) && error.response?.status === 422;
}

export function isTooManyRequests(error: unknown) {
  return isAxiosError(error) && error.response?.status === 429;
}

export function isEmailUnverifiedError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 401 &&
    error.response?.data?.message === 'UNVERIFIED_EMAIL'
  );
}

export function isEmailAlreadyVerifiedError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response?.data?.message === 'EMAIL_ALREADY_VERIFIED'
  );
}

export function isTokenExpiredError(error: unknown) {
  return (
    isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response?.data?.message === 'TOKEN_EXPIRED'
  );
}

// ------------------------------------------------------------------

export function createAxiosError(
  status?: number,
  data?: Record<string, unknown>
) {
  return {
    isAxiosError: true,
    response: {
      status,
      data,
    } as AxiosResponse,
  };
}

export function createBadRequestError(data?: Record<string, unknown>) {
  return createAxiosError(400, data);
}

export function createUnauthorizedError(data?: Record<string, unknown>) {
  return createAxiosError(401, data);
}

export function createForbiddenError(data?: Record<string, unknown>) {
  return createAxiosError(403, data);
}

export function createNotFoundError(data?: Record<string, unknown>) {
  return createAxiosError(404, data);
}

export function createConflictError(data?: Record<string, unknown>) {
  return createAxiosError(409, data);
}

export function createUnprocessableEntityError(data?: Record<string, unknown>) {
  return createAxiosError(422, data);
}

export function createIsTooManyRequests(data?: Record<string, unknown>) {
  return createAxiosError(429, data);
}
