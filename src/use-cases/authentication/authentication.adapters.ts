export type LoginError =
  'RATE_LIMIT' | 'INVALID_CREDENTIALS' | 'UNVERIFIED_EMAIL';

// String values (not the default numeric 0/1/2): RTK Query's `queryFn`
// treats a falsy `error` as "no error" (see design.md's `queryFn` gotcha),
// and `TOKEN_EXPIRED` would otherwise default to `0`.
export enum VerifyEmailTokenErrorType {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  ALREADY_VERIFIED = 'ALREADY_VERIFIED',
}

export enum VerifyOtpErrorType {
  EXPIRED = 'EXPIRED',
  INVALID = 'INVALID',
}
