import moment from 'moment';

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_DIGITS_COUNT = 8;

export const DATE_INPUT_PLACEHOLDER = 'jj/mm/aaaa';
const DATE_INPUT_TEMPLATE = '--/--/----';
export const DATE_INCOMPLETE_MESSAGE =
  "Date incomplète. Saisissez le jour, le mois et l'année.";
export const DATE_IMPOSSIBLE_MESSAGE =
  "Cette date n'existe pas. Vérifiez le jour et le mois.";

const countDigits = (value: string) => value.replace(/\D/g, '').length;

/**
 * Formats raw typed or pasted text as a partial `dd/mm/yyyy` date: keeps the
 * first 8 digits and adds the `/` separators on its own. A trailing `/` is
 * never kept, so a backspace removes the separator together with its digit.
 */
export const maskDateInput = (rawValue: string): string => {
  const digits = rawValue.replace(/\D/g, '').slice(0, DATE_DIGITS_COUNT);
  let masked = digits.slice(0, 2);
  if (digits.length > 2) {
    masked += `/${digits.slice(2, 4)}`;
  }
  if (digits.length > 4) {
    masked += `/${digits.slice(4, 8)}`;
  }
  return masked;
};

/**
 * Whether a `YYYY-MM-DD` string is a real calendar date (no 31 February).
 */
export const isValidIsoDate = (value: string): boolean => {
  return (
    ISO_DATE_REGEX.test(value) && moment(value, 'YYYY-MM-DD', true).isValid()
  );
};

/**
 * Converts a stored `YYYY-MM-DD` date to its `dd/mm/yyyy` display.
 * Anything that is not a valid ISO date gives an empty string.
 */
export const isoToDisplayDate = (isoDate: string): string => {
  if (!isValidIsoDate(isoDate)) {
    return '';
  }
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Converts a masked `dd/mm/yyyy` text to `YYYY-MM-DD`.
 * An incomplete or impossible date gives `null`.
 */
export const displayDateToIso = (displayDate: string): string | null => {
  if (countDigits(displayDate) !== DATE_DIGITS_COUNT) {
    return null;
  }
  const [day, month, year] = maskDateInput(displayDate).split('/');
  const isoDate = `${year}-${month}-${day}`;
  return isValidIsoDate(isoDate) ? isoDate : null;
};

/**
 * Error message of a form value: an empty value and a valid `YYYY-MM-DD` date
 * have none. Any other value is the typed text of an unfinished or impossible
 * date, which the field hands to the form so that it cannot be submitted.
 */
export const getDateValueError = (value?: string | null): string => {
  if (!value || isValidIsoDate(value)) {
    return '';
  }
  return countDigits(value) < DATE_DIGITS_COUNT
    ? DATE_INCOMPLETE_MESSAGE
    : DATE_IMPOSSIBLE_MESSAGE;
};

export const END_DATE_BEFORE_START_MESSAGE =
  'La date de fin ne peut pas être antérieure à la date de début.';

/**
 * Whether an end date is not before its start date. A same-day end is fine,
 * and the rule only applies once both dates are complete real dates.
 */
export const isEndDateNotBeforeStart = (
  endDate?: string | null,
  startDate?: string | null
): boolean => {
  if (!endDate || !startDate) {
    return true;
  }
  if (!isValidIsoDate(endDate) || !isValidIsoDate(startDate)) {
    return true;
  }
  // `YYYY-MM-DD` strings sort like the dates they stand for
  return endDate >= startDate;
};

/**
 * What is left to type after a partial `dd/mm/yyyy` text, as dashes: `19`
 * gives `/--/----`. Empty for an empty or a complete text.
 */
export const getDateInputRemainder = (maskedText: string): string => {
  if (!maskedText) {
    return '';
  }
  return DATE_INPUT_TEMPLATE.slice(maskedText.length);
};
