import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { referingActions } from '@/src/use-cases/refering';
import { useConfirmation } from './Confirmation/useConfirmation';
import { useConfirmationRedirection } from './Confirmation/useConfirmationRedirection';
import { useReferingRedirection } from './useReferingRedirection';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const replace = jest.fn();

const setup = <T,>(hook: () => T, store = createTestStore()) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...renderHook(hook, { wrapper }) };
};

const mockQuery = (query: Record<string, string>) =>
  (useRouter as jest.Mock).mockReturnValue({ replace, query });

describe('useReferingRedirection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to the first step when the URL has no step', () => {
    mockQuery({});
    const { result } = setup(() => useReferingRedirection());
    expect(replace).toHaveBeenCalledWith('/backoffice/referer/orienter/step-1');
    expect(result.current.isLoading).toBe(true);
  });

  it('redirects to the first step when a later step is opened directly', () => {
    mockQuery({ step: 'step-3' });
    const { store } = setup(() => useReferingRedirection());
    expect(replace).toHaveBeenCalledWith('/backoffice/referer/orienter/step-1');
    expect(store.getState().refering.currentStep).toBeNull();
  });

  it('stores the first step in the store without redirecting', () => {
    mockQuery({ step: 'step-1' });
    const { store, result } = setup(() => useReferingRedirection());
    expect(replace).not.toHaveBeenCalled();
    expect(store.getState().refering.currentStep).toBe('step-1');
    expect(result.current.isLoading).toBe(false);
  });

  it('follows a later step once the flow has started', () => {
    mockQuery({ step: 'step-2' });
    const store = createTestStore();
    store.dispatch(referingActions.setReferingStep('step-1'));
    setup(() => useReferingRedirection(), store);
    expect(replace).not.toHaveBeenCalled();
    expect(store.getState().refering.currentStep).toBe('step-2');
  });
});

describe('useConfirmationRedirection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery({});
  });

  it('sends back to the first step when nothing was submitted', () => {
    const { result } = setup(() => useConfirmationRedirection());
    expect(replace).toHaveBeenCalledWith('/backoffice/referer/orienter/step-1');
    expect(result.current.isLoading).toBe(true);
  });

  it('stays on the confirmation when refering data exists', () => {
    const store = createTestStore();
    store.dispatch(referingActions.setReferingStep('step-1'));
    store.dispatch(
      referingActions.setReferingCurrentStepData({ firstName: 'Awa' } as any)
    );
    const { result } = setup(() => useConfirmationRedirection(), store);
    expect(replace).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useConfirmation', () => {
  it('clears the current step on mount and the data on unmount', () => {
    const store = createTestStore();
    store.dispatch(referingActions.setReferingStep('step-1'));
    store.dispatch(
      referingActions.setReferingCurrentStepData({ firstName: 'Awa' } as any)
    );
    const { result, unmount } = setup(() => useConfirmation(), store);
    expect(store.getState().refering.currentStep).toBeNull();
    expect(result.current.pageContent.bullets.length).toBeGreaterThan(0);
    expect(result.current.pageContent.title).toContain('pré-inscrire');
    unmount();
    expect(store.getState().refering.data).toEqual({});
  });
});
