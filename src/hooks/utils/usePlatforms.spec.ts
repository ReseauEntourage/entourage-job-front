import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useIsDesktop, useIsMobile } from './usePlatforms';
import { useSSRDataContext } from './useSSRDataContext';

// ESM-only dependency, see the note in useContactEligibility.spec.tsx.
jest.mock('@react-hook/window-size', () => ({ useWindowWidth: jest.fn() }));
jest.mock('./useSSRDataContext', () => ({ useSSRDataContext: jest.fn() }));

const { useWindowWidth } = jest.requireMock('@react-hook/window-size');
const mockUseSSRDataContext = useSSRDataContext as jest.Mock;

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';

describe('usePlatforms', () => {
  beforeEach(() => {
    mockUseSSRDataContext.mockReturnValue({ userAgent: DESKTOP_UA });
  });

  it('is desktop when the window is at least 960px wide', () => {
    useWindowWidth.mockReturnValue(960);
    expect(renderHook(() => useIsDesktop()).result.current).toBe(true);
    expect(renderHook(() => useIsMobile()).result.current).toBe(false);
  });

  it('is mobile when the window is narrower than 960px, whatever the user agent', () => {
    useWindowWidth.mockReturnValue(959);
    expect(renderHook(() => useIsDesktop()).result.current).toBe(false);
    expect(renderHook(() => useIsMobile()).result.current).toBe(true);
  });

  it('follows window width changes', () => {
    useWindowWidth.mockReturnValue(1200);
    const { result, rerender } = renderHook(() => useIsDesktop());
    expect(result.current).toBe(true);

    useWindowWidth.mockReturnValue(500);
    rerender();
    expect(result.current).toBe(false);
  });

  it('lets the window width override a mobile user agent once mounted', () => {
    mockUseSSRDataContext.mockReturnValue({ userAgent: IPHONE_UA });
    useWindowWidth.mockReturnValue(1400);
    expect(renderHook(() => useIsDesktop()).result.current).toBe(true);
  });
});
