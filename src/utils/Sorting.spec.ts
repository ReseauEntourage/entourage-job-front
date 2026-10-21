// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { sortByOrder } from './Sorting';

describe('sortByOrder', () => {
  it('sorts by ascending order without mutating the input', () => {
    const input = [
      { order: 2, id: 'b' },
      { order: 0, id: 'a' },
      { order: 1, id: 'c' },
    ];
    const result = sortByOrder(input);
    expect(result.map((i) => i.id)).toEqual(['a', 'c', 'b']);
    expect(input.map((i) => i.id)).toEqual(['b', 'a', 'c']);
    expect(result).not.toBe(input);
  });

  it('returns an empty array for an empty list', () => {
    expect(sortByOrder([])).toEqual([]);
  });
});
