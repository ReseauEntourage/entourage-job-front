// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { assertCondition, assertIsDefined } from './asserts';

describe('assertIsDefined', () => {
  it('does not throw for defined values, including falsy ones', () => {
    expect(() => assertIsDefined('')).not.toThrow();
    expect(() => assertIsDefined(0)).not.toThrow();
    expect(() => assertIsDefined(false)).not.toThrow();
  });

  it('throws for null and undefined, with the custom message', () => {
    expect(() => assertIsDefined(null)).toThrow('Assertion error');
    expect(() => assertIsDefined(undefined, 'custom detail')).toThrow(
      'custom detail'
    );
  });
});

describe('assertCondition', () => {
  it('does not throw when the condition is true', () => {
    expect(() => assertCondition(true)).not.toThrow();
  });

  it('throws when the condition is false', () => {
    expect(() => assertCondition(false, 'nope')).toThrow('nope');
  });
});
