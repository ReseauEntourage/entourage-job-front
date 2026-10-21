import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useLayoutEffect } from 'react';

import { useMount } from './useMount';

describe('useMount', () => {
  it('runs the callback once, on mount only', () => {
    const fn = jest.fn();
    const { rerender } = renderHook(() => useMount(fn));
    expect(fn).toHaveBeenCalledTimes(1);

    rerender();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('supports a custom effect hook', () => {
    const fn = jest.fn();
    renderHook(() => useMount(fn, { hook: useLayoutEffect }));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('runs the returned cleanup on unmount', () => {
    const cleanup = jest.fn();
    const { unmount } = renderHook(() => useMount(() => cleanup));
    expect(cleanup).not.toHaveBeenCalled();
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
