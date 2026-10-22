import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useFileActivator } from './useFileActivator';

describe('useFileActivator', () => {
  it('does nothing before an input is registered', () => {
    const { result } = renderHook(() => useFileActivator());
    expect(() =>
      act(() => result.current.requestFileUploadClick())
    ).not.toThrow();
  });

  it('clicks the registered file input', () => {
    const { result } = renderHook(() => useFileActivator());
    const input = document.createElement('input');
    const click = jest.spyOn(input, 'click');

    result.current.setFileInputRef(input);
    result.current.requestFileUploadClick();

    expect(result.current.fileInputRef.current).toBe(input);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('keeps the previous input when the ref callback receives null', () => {
    const { result } = renderHook(() => useFileActivator());
    const input = document.createElement('input');
    result.current.setFileInputRef(input);
    result.current.setFileInputRef(null);
    expect(result.current.fileInputRef.current).toBe(input);
  });
});
