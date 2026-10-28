// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  DATE_IMPOSSIBLE_MESSAGE,
  DATE_INCOMPLETE_MESSAGE,
  displayDateToIso,
  getDateValueError,
  isEndDateNotBeforeStart,
  isoToDisplayDate,
  isValidIsoDate,
  maskDateInput,
} from './DateInput';

describe('DateInput', () => {
  describe('maskDateInput', () => {
    it('adds the separators while typing digits', () => {
      expect(maskDateInput('1')).toBe('1');
      expect(maskDateInput('14')).toBe('14');
      expect(maskDateInput('140')).toBe('14/0');
      expect(maskDateInput('14031')).toBe('14/03/1');
      expect(maskDateInput('14031987')).toBe('14/03/1987');
    });

    it('drops the separator together with its digit on a backspace', () => {
      expect(maskDateInput('14/0')).toBe('14/0');
      expect(maskDateInput('14/')).toBe('14');
      expect(maskDateInput('14/03/')).toBe('14/03');
    });

    it('keeps a pasted date as it is', () => {
      expect(maskDateInput('14/03/1987')).toBe('14/03/1987');
    });

    it('ignores letters and extra digits', () => {
      expect(maskDateInput('1a4-03.1987999')).toBe('14/03/1987');
      expect(maskDateInput('abc')).toBe('');
    });
  });

  describe('isValidIsoDate', () => {
    it('accepts real dates, including a leap day', () => {
      expect(isValidIsoDate('1987-03-14')).toBe(true);
      expect(isValidIsoDate('2024-02-29')).toBe(true);
    });

    it('rejects impossible or malformed dates', () => {
      expect(isValidIsoDate('1990-02-31')).toBe(false);
      expect(isValidIsoDate('2023-02-29')).toBe(false);
      expect(isValidIsoDate('14/03/1987')).toBe(false);
      expect(isValidIsoDate('')).toBe(false);
    });
  });

  describe('isoToDisplayDate', () => {
    it('formats a stored date as dd/mm/yyyy', () => {
      expect(isoToDisplayDate('1987-03-14')).toBe('14/03/1987');
    });

    it('gives an empty text for anything else', () => {
      expect(isoToDisplayDate('')).toBe('');
      expect(isoToDisplayDate('14/03')).toBe('');
    });
  });

  describe('displayDateToIso', () => {
    it('converts a complete real date', () => {
      expect(displayDateToIso('14/03/1987')).toBe('1987-03-14');
    });

    it('gives null for an incomplete or impossible date', () => {
      expect(displayDateToIso('14/03')).toBeNull();
      expect(displayDateToIso('31/02/1990')).toBeNull();
      expect(displayDateToIso('')).toBeNull();
    });
  });

  describe('getDateValueError', () => {
    it('has no error for an empty value or a valid date', () => {
      expect(getDateValueError('')).toBe('');
      expect(getDateValueError(undefined)).toBe('');
      expect(getDateValueError('1987-03-14')).toBe('');
    });

    it('flags an incomplete date', () => {
      expect(getDateValueError('14/03')).toBe(DATE_INCOMPLETE_MESSAGE);
    });

    it('flags an impossible date', () => {
      expect(getDateValueError('31/02/1990')).toBe(DATE_IMPOSSIBLE_MESSAGE);
    });
  });

  describe('isEndDateNotBeforeStart', () => {
    it('refuses an end date before the start date', () => {
      expect(isEndDateNotBeforeStart('2023-06-01', '2023-09-01')).toBe(false);
    });

    it('accepts an end on the same day or after the start', () => {
      expect(isEndDateNotBeforeStart('2023-09-01', '2023-09-01')).toBe(true);
      expect(isEndDateNotBeforeStart('2024-01-01', '2023-09-01')).toBe(true);
    });

    it('accepts an empty end date, as for a current job', () => {
      expect(isEndDateNotBeforeStart('', '2023-09-01')).toBe(true);
      expect(isEndDateNotBeforeStart(undefined, '2023-09-01')).toBe(true);
    });

    it('does not apply while a date is incomplete', () => {
      expect(isEndDateNotBeforeStart('01/06', '2023-09-01')).toBe(true);
      expect(isEndDateNotBeforeStart('2023-06-01', '01/09')).toBe(true);
      expect(isEndDateNotBeforeStart('2023-06-01', '')).toBe(true);
    });
  });
});
