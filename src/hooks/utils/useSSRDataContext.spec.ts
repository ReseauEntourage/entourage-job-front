import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useSSRDataContext } from './useSSRDataContext';

describe('useSSRDataContext', () => {
  it('returns the empty default value when no provider is mounted', () => {
    const { result } = renderHook(() => useSSRDataContext());
    expect(result.current).toEqual({});
  });
});
