// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { mutateToArray } from './Mutating';

describe('mutateToArray', () => {
  it('wraps a single value in an array', () => {
    expect(mutateToArray('a')).toEqual(['a']);
    expect(mutateToArray(0)).toEqual([0]);
  });

  it('returns arrays untouched', () => {
    const arr = [1, 2];
    expect(mutateToArray(arr)).toBe(arr);
  });

  it('keeps null and undefined as is', () => {
    expect(mutateToArray(null)).toBeNull();
    expect(mutateToArray(undefined)).toBeUndefined();
  });
});
