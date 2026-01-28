const ISO_DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function parseISODateOnly(value: string): Date | null {
  if (!value || !ISO_DATE_ONLY_REGEX.test(value)) {
    return null;
  }

  // Force UTC midnight to avoid timezone edge cases.
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // Reject impossible dates like 1996-24-04 or 2023-02-31.
  if (date.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return date;
}

function utcToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
}

export function isBirthDateNotInFuture(birthDate: Date): boolean {
  return birthDate.getTime() <= utcToday().getTime();
}

export function isBirthDateAtLeastAge(
  birthDate: Date,
  minAgeYears: number
): boolean {
  const cutoff = utcToday();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - minAgeYears);
  return birthDate.getTime() <= cutoff.getTime();
}

export function isBirthDateAtMostAge(
  birthDate: Date,
  maxAgeYears: number
): boolean {
  const oldestAllowed = utcToday();
  oldestAllowed.setUTCFullYear(oldestAllowed.getUTCFullYear() - maxAgeYears);
  return birthDate.getTime() >= oldestAllowed.getTime();
}
