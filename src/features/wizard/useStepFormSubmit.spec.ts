import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { FormWithValidationRef } from '@/src/features/forms/FormWithValidation';
import { useStepFormSubmit } from './useStepFormSubmit';

function makeRef(submit?: jest.Mock) {
  return {
    current: submit ? ({ submit } as unknown as FormWithValidationRef) : null,
  };
}

describe('useStepFormSubmit', () => {
  it('returns false when the form submission explicitly fails', async () => {
    const submit = jest.fn().mockResolvedValue(false);
    const { result } = renderHook(() => useStepFormSubmit(makeRef(submit)));

    await expect(result.current()).resolves.toBe(false);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('does not block the wizard when the submission succeeds', async () => {
    const submit = jest.fn().mockResolvedValue(true);
    const { result } = renderHook(() => useStepFormSubmit(makeRef(submit)));

    await expect(result.current()).resolves.toBeUndefined();
  });

  it('does not block the wizard when the submission returns nothing', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useStepFormSubmit(makeRef(submit)));

    await expect(result.current()).resolves.toBeUndefined();
  });

  it('does not block the wizard when the form ref is not mounted', async () => {
    const { result } = renderHook(() => useStepFormSubmit(makeRef()));

    await expect(result.current()).resolves.toBeUndefined();
  });
});
