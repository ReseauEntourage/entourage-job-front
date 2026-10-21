import { renderHook, act } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useIsAtBottom } from './useIsAtBottom';

let scrollCallback: (args: { currPos: { x: number; y: number } }) => void;

jest.mock('@n8tb1t/use-scroll-position', () => ({
  useScrollPosition: (cb: typeof scrollCallback) => {
    scrollCallback = cb;
  },
}));
// ESM-only dependency, see the note in useContactEligibility.spec.tsx.
jest.mock('@react-hook/window-size', () => ({ useWindowHeight: () => 800 }));

const scrollTo = (y: number) =>
  act(() => scrollCallback({ currPos: { x: 0, y: -y } }));

describe('useIsAtBottom', () => {
  beforeEach(() => {
    Object.defineProperty(document.body, 'offsetHeight', {
      configurable: true,
      value: 2000,
    });
  });

  it('increments the offset once when the bottom is reached', () => {
    const setOffset = jest.fn();
    renderHook(() => useIsAtBottom(setOffset));

    scrollTo(100);
    expect(setOffset).not.toHaveBeenCalled();

    scrollTo(1200);
    expect(setOffset).toHaveBeenCalledTimes(1);
    expect(setOffset.mock.calls[0][0](5)).toBe(6);
  });

  it('can trigger again after leaving the bottom', () => {
    const setOffset = jest.fn();
    renderHook(() => useIsAtBottom(setOffset));

    scrollTo(1500);
    scrollTo(100);
    scrollTo(1500);
    expect(setOffset).toHaveBeenCalledTimes(2);
  });

  it('works without a setOffset callback', () => {
    renderHook(() => useIsAtBottom());
    expect(() => scrollTo(1500)).not.toThrow();
  });
});
