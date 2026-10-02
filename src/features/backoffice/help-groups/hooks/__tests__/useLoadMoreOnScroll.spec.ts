import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useLoadMoreOnScroll } from '../useLoadMoreOnScroll';

let reachBottom: () => void = () => {};

jest.mock('@/src/hooks/useIsAtBottom', () => ({
  useIsAtBottom: (setOffset: (update: (prev: number) => number) => void) => {
    reachBottom = () => setOffset((prev) => prev + 1);
  },
}));

const setPageHeight = (height: number) =>
  Object.defineProperty(document.body, 'offsetHeight', {
    configurable: true,
    value: height,
  });

describe('useLoadMoreOnScroll', () => {
  // A page taller than the viewport, unless a test says otherwise
  beforeEach(() => setPageHeight(10000));
  it('loads the next page when the bottom is reached', () => {
    const fetchNextPage = jest.fn();
    renderHook(() =>
      useLoadMoreOnScroll({
        hasNextPage: true,
        isFetching: false,
        fetchNextPage,
      })
    );
    act(() => reachBottom());
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('serves a bottom reached during a request once it completes', () => {
    const fetchNextPage = jest.fn();
    const { rerender } = renderHook(
      ({ isFetching }) =>
        useLoadMoreOnScroll({ hasNextPage: true, isFetching, fetchNextPage }),
      { initialProps: { isFetching: true } }
    );
    act(() => reachBottom());
    expect(fetchNextPage).not.toHaveBeenCalled();
    rerender({ isFetching: false });
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
    // Served once: no new request without a new bottom reached
    rerender({ isFetching: true });
    rerender({ isFetching: false });
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('does nothing without a next page', () => {
    const fetchNextPage = jest.fn();
    renderHook(() =>
      useLoadMoreOnScroll({
        hasNextPage: false,
        isFetching: false,
        fetchNextPage,
      })
    );
    act(() => reachBottom());
    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('keeps loading while the page is shorter than the viewport', () => {
    setPageHeight(100);
    const fetchNextPage = jest.fn();
    const { rerender } = renderHook(
      ({ isFetching, hasNextPage }) =>
        useLoadMoreOnScroll({ hasNextPage, isFetching, fetchNextPage }),
      { initialProps: { isFetching: false, hasNextPage: true } }
    );
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
    rerender({ isFetching: true, hasNextPage: true });
    rerender({ isFetching: false, hasNextPage: true });
    expect(fetchNextPage).toHaveBeenCalledTimes(2);
    // Stops on the last page
    rerender({ isFetching: true, hasNextPage: false });
    rerender({ isFetching: false, hasNextPage: false });
    expect(fetchNextPage).toHaveBeenCalledTimes(2);
  });
});
