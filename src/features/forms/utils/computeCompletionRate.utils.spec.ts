// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { listCompletionFields } from './computeCompletionRate.utils';

describe('listCompletionFields', () => {
  it('flags primitives as filled or empty', () => {
    expect(
      listCompletionFields({
        text: 'hello',
        blank: '   ',
        empty: '',
        nil: null,
        undef: undefined,
        num: 0,
        nan: NaN,
        yes: true,
        no: false,
      })
    ).toEqual([
      { path: 'text', isFilled: true },
      { path: 'blank', isFilled: false },
      { path: 'empty', isFilled: false },
      { path: 'nil', isFilled: false },
      { path: 'undef', isFilled: false },
      { path: 'num', isFilled: true },
      { path: 'nan', isFilled: false },
      { path: 'yes', isFilled: true },
      { path: 'no', isFilled: false },
    ]);
  });

  it('handles dates and blobs', () => {
    expect(
      listCompletionFields({
        goodDate: new Date('2026-01-01'),
        badDate: new Date('nope'),
        file: new Blob(['x']),
      })
    ).toEqual([
      { path: 'goodDate', isFilled: true },
      { path: 'badDate', isFilled: false },
      { path: 'file', isFilled: true },
    ]);
  });

  it('counts an array as a single field, filled when not empty', () => {
    expect(listCompletionFields({ full: [1, 2], none: [] })).toEqual([
      { path: 'full', isFilled: true },
      { path: 'none', isFilled: false },
    ]);
  });

  it('treats { value } objects (react-select options) as a single field', () => {
    expect(
      listCompletionFields({
        picked: { value: 'a', label: 'A' },
        unpicked: { value: '', label: '' },
      })
    ).toEqual([
      { path: 'picked', isFilled: true },
      { path: 'unpicked', isFilled: false },
    ]);
  });

  it('flattens nested objects with dot paths and counts empty objects as unfilled', () => {
    expect(
      listCompletionFields({ a: { b: 'x', c: { d: '' } }, e: {} })
    ).toEqual([
      { path: 'a.b', isFilled: true },
      { path: 'a.c.d', isFilled: false },
      { path: 'e', isFilled: false },
    ]);
  });

  it('skips excluded paths, including nested ones', () => {
    expect(
      listCompletionFields(
        { keep: 'x', drop: 'y', a: { drop: 'z', keep: 'w' } },
        { excludePaths: ['drop', 'a.drop'] }
      )
    ).toEqual([
      { path: 'keep', isFilled: true },
      { path: 'a.keep', isFilled: true },
    ]);
  });

  it('returns nothing for a top-level primitive or array (no path)', () => {
    expect(listCompletionFields('x')).toEqual([]);
    expect(listCompletionFields([1])).toEqual([]);
    expect(listCompletionFields(null)).toEqual([]);
  });
});
