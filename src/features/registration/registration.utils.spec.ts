// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UtmParameters } from '@/src/hooks/queryParams/useUTM';
import {
  getUtmFromLocalStorage,
  incrementRegistrationStep,
} from './registration.utils';

describe('registration.utils', () => {
  afterEach(() => localStorage.clear());

  it('incrementRegistrationStep moves to the next step', () => {
    expect(incrementRegistrationStep(-1)).toBe(0);
    expect(incrementRegistrationStep(3)).toBe(4);
  });

  it('getUtmFromLocalStorage returns only the stored UTM parameters', () => {
    localStorage.setItem(UtmParameters.UTM_SOURCE, 'newsletter');
    localStorage.setItem(UtmParameters.UTM_CAMPAIGN, 'spring');
    localStorage.setItem('unrelated', 'x');

    const result = getUtmFromLocalStorage() as any;

    expect(result[UtmParameters.UTM_SOURCE]).toBe('newsletter');
    expect(result[UtmParameters.UTM_CAMPAIGN]).toBe('spring');
    expect(result[UtmParameters.UTM_MEDIUM]).toBeUndefined();
    expect(result.unrelated).toBeUndefined();
  });

  it('getUtmFromLocalStorage ignores empty values', () => {
    localStorage.setItem(UtmParameters.UTM_TERM, '');

    expect((getUtmFromLocalStorage() as any)[UtmParameters.UTM_TERM]).toBe(
      undefined
    );
  });
});
