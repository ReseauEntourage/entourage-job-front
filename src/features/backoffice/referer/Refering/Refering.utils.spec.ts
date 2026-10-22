// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { flattenReferingData, incrementReferingStep } from './Refering.utils';

describe('Refering.utils', () => {
  describe('incrementReferingStep', () => {
    it('returns the following step', () => {
      expect(incrementReferingStep('step-1')).toBe('step-2');
      expect(incrementReferingStep('step-9')).toBe('step-10');
    });
  });

  describe('flattenReferingData', () => {
    it('returns an empty object without data', () => {
      expect(flattenReferingData({})).toEqual({});
    });

    it('merges the data of every step in a single object', () => {
      const flat = flattenReferingData({
        1: { firstName: 'Awa', lastName: 'D' },
        3: { email: 'awa@test.fr' },
      } as any);
      expect(flat).toEqual({
        firstName: 'Awa',
        lastName: 'D',
        email: 'awa@test.fr',
      });
    });

    it('skips steps without data', () => {
      const flat = flattenReferingData({
        1: undefined,
        2: { firstName: 'Awa' },
      } as any);
      expect(flat).toEqual({ firstName: 'Awa' });
    });
  });
});
