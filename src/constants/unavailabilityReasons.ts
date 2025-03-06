export const UnavailabilityReasons = {
  NO_MORE_TIME: 'no_more_time',
  VACATION: 'vacation',
  ALREADY_FULL: 'already_full',
  NO_MORE_HELP: 'no_more_help',
  OTHER_SUPPORT: 'other_support',
} as const;

export type UnavailabilityReason =
  (typeof UnavailabilityReasons)[keyof typeof UnavailabilityReasons];
