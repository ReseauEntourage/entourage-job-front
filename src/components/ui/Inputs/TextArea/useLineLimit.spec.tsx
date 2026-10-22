import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useLineLimit } from './useLineLimit';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1000,
}));

// jsdom does no layout: heights are faked on a detached textarea.
const fakeTextArea = ({
  offsetHeight,
  scrollHeight,
}: {
  offsetHeight: number;
  scrollHeight: number;
}) => {
  const ta = document.createElement('textarea');
  ta.style.lineHeight = '20px';
  ta.style.paddingTop = '0px';
  ta.style.paddingBottom = '0px';
  Object.defineProperty(ta, 'offsetHeight', {
    value: offsetHeight,
    configurable: true,
  });
  Object.defineProperty(ta, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  return ta;
};

describe('useLineLimit', () => {
  it('reports no remaining lines without a line limit', () => {
    const { result } = renderHook(() => useLineLimit('abc', 'name', jest.fn()));

    expect(result.current.remainingLines).toBe(0);
    expect(result.current.maxLinesReached).toBe(false);
  });

  it('counts the lines of the content and the remaining ones', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLineLimit(value, 'name', jest.fn(), 5),
      { initialProps: { value: '' } }
    );
    (result.current.textAreaRef as { current: unknown }).current = fakeTextArea(
      {
        offsetHeight: 40,
        scrollHeight: 60,
      }
    );

    rerender({ value: 'a\nb\nc' });

    expect(result.current.remainingLines).toBe(2);
    expect(result.current.maxLinesReached).toBe(false);
  });

  it('flags when the limit is exceeded', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLineLimit(value, 'name', jest.fn(), 2),
      { initialProps: { value: '' } }
    );
    (result.current.textAreaRef as { current: unknown }).current = fakeTextArea(
      {
        offsetHeight: 40,
        scrollHeight: 60,
      }
    );

    rerender({ value: 'a\nb\nc' });

    expect(result.current.remainingLines).toBe(-1);
    expect(result.current.maxLinesReached).toBe(true);
  });

  it('resets the count when the content is emptied', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLineLimit(value, 'name', jest.fn(), 3),
      { initialProps: { value: 'x' } }
    );
    (result.current.textAreaRef as { current: unknown }).current = fakeTextArea(
      {
        offsetHeight: 40,
        scrollHeight: 60,
      }
    );
    rerender({ value: 'a\nb\nc' });
    expect(result.current.remainingLines).toBe(0);

    rerender({ value: '' });

    expect(result.current.remainingLines).toBe(3);
  });

  describe('text area width inside a modal', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('is the window width minus the modal margins and body paddings', () => {
      document.body.innerHTML = `
        <div id="modal-screen"><div style="margin-left: 10px; margin-right: 10px"></div></div>
        <div id="modal-generic"><div style="padding-left: 20px; padding-right: 20px"></div></div>`;
      const { result } = renderHook(() => useLineLimit('a', 'name', jest.fn()));

      expect(result.current.textAreaWidth).toBe(940);
    });

    it('stays at zero outside of a modal', () => {
      const { result } = renderHook(() => useLineLimit('a', 'name', jest.fn()));

      expect(result.current.textAreaWidth).toBe(0);
    });

    it('stays at zero when the modal has no body', () => {
      document.body.innerHTML = '<div id="modal-screen"><div></div></div>';
      const { result } = renderHook(() => useLineLimit('a', 'name', jest.fn()));

      expect(result.current.textAreaWidth).toBe(0);
    });
  });
});
