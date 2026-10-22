// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CandidateYesNoNSPP } from '@/src/constants';
import { formReferingInfo } from './formReferingInfo';

const getRules = (name: string): any[] =>
  ((formReferingInfo.fields as any[]).find((field) => field.name === name)
    ?.rules ?? []) as any[];

const yearsAgo = (years: number, extraDays = 0) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  date.setDate(date.getDate() + extraDays);
  return date.toISOString();
};

describe('formReferingInfo', () => {
  describe('birthDate', () => {
    const [adultRule, validRule] = getRules('birthDate');

    it('rejects a candidate under 18 years old', () => {
      expect(adultRule.method(yearsAgo(17))).toBe(false);
      expect(adultRule.method(yearsAgo(18, 2))).toBe(false);
    });

    it('accepts a candidate over 18 years old', () => {
      expect(adultRule.method(yearsAgo(18, -2))).toBe(true);
      expect(adultRule.method(yearsAgo(40))).toBe(true);
    });

    it('rejects an implausibly old birth date', () => {
      expect(validRule.method(yearsAgo(121))).toBe(false);
      expect(validRule.method(yearsAgo(60))).toBe(true);
    });
  });

  it('blocks candidates without the right to work in France', () => {
    const [rule] = getRules('workingRight');
    expect(rule.method(CandidateYesNoNSPP.NO)).toBe(false);
    expect(rule.method(CandidateYesNoNSPP.YES)).toBe(true);
  });
});
