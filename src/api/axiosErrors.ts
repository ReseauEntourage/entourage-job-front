/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

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

// ------------------------------------------------------------------

function createAxiosError(status: number) {
  return {
    isAxiosError: true,
    response: {
      status,
    },
  };
}

export function createBadRequestError() {
  return createAxiosError(400);
}

export function createUnauthorizedError() {
  return createAxiosError(401);
}

export function createForbiddenError() {
  return createAxiosError(403);
}

export function createNotFoundError() {
  return createAxiosError(404);
}

export function createConflictError() {
  return createAxiosError(409);
}

export function createUnprocessableEntityError() {
  return createAxiosError(422);
}

export function createIsTooManyRequests() {
  return createAxiosError(429);
}
