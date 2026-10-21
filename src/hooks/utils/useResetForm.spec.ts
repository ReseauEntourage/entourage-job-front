import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useResetForm } from './useResetForm';

describe('useResetForm', () => {
  it('does nothing when the form ref is not attached', () => {
    const { result } = renderHook(() => useResetForm());
    expect(() => act(() => result.current[1]())).not.toThrow();
  });

  it('calls resetForm on the attached form', () => {
    const { result } = renderHook(() => useResetForm());
    const resetForm = jest.fn();
    // The ref is read-only typed, but React assigns it to the mounted form.
    (result.current[0] as { current: unknown }).current = { resetForm };

    act(() => result.current[1]());

    expect(resetForm).toHaveBeenCalledTimes(1);
  });
});
