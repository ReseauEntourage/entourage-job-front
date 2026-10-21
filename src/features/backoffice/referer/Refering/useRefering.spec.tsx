import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { referingActions } from '@/src/use-cases/refering';
import { useRefering } from './useRefering';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/api');

const push = jest.fn();
const back = jest.fn();
const replace = jest.fn();

const setup = (step: 'step-1' | 'step-3' | 'step-4' = 'step-1') => {
  const store = createTestStore();
  store.dispatch(referingActions.setReferingStep(step));
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...renderHook(() => useRefering(), { wrapper }) };
};

describe('useRefering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push, back, replace });
  });

  it('exposes the content of the first step', () => {
    const { result } = setup('step-1');
    expect(result.current.isFirstReferingStep).toBe(true);
    expect(result.current.isLastReferingStep).toBe(false);
    expect(result.current.defaultValues).toBeNull();
    expect(result.current.stepContent.form.id).toBe('form-refering-account');
  });

  it('stores the step data and goes to the next step', async () => {
    const { result, store } = setup('step-1');
    await act(async () => {
      await result.current.onSubmitStepForm({ firstName: 'Awa' } as any);
    });
    expect(store.getState().refering.data['step-1' as any]).toEqual({
      firstName: 'Awa',
    });
    expect(push).toHaveBeenCalledWith(
      '/backoffice/referer/orienter/step-2',
      undefined,
      { shallow: true }
    );
  });

  it('goes back through the router', () => {
    const { result } = setup('step-1');
    result.current.onBack();
    expect(back).toHaveBeenCalled();
  });

  it('notifies a duplicated email when the submission conflicts', async () => {
    (Api.postUserRefering as jest.Mock).mockRejectedValue({
      isAxiosError: true,
      response: { status: 409 },
    });
    const { result, store } = setup('step-4');
    store.dispatch(
      referingActions.setReferingCurrentStepData({
        department: { value: '75' },
      } as any)
    );
    await waitFor(() =>
      expect(
        store.getState().notifications.notifications.length
      ).toBeGreaterThan(0)
    );
    expect(store.getState().notifications.notifications[0].message).toBe(
      'Cette adresse email est déjà utilisée'
    );
    expect(result.current.isReferingLoading).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });

  it('goes to the confirmation page once the candidate is referred', async () => {
    (Api.postUserRefering as jest.Mock).mockResolvedValue({});
    const { store } = setup('step-4');
    store.dispatch(
      referingActions.setReferingCurrentStepData({
        department: { value: '75' },
      } as any)
    );
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith(
        { pathname: '/backoffice/referer/orienter/confirmation' },
        undefined,
        { shallow: true }
      )
    );
  });
});
