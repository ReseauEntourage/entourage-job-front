jest.mock('@/src/api');

jest.mock('next/router', () => ({ useRouter: jest.fn() }));

import { act, cleanup, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { flushPromises } from '@/src/store/testUtils/flushPromises';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { authenticationActions } from '@/src/use-cases/authentication';
import { useVerifyEmail } from './useVerifyEmail';

const mockedApi = getMockedApi();
const mockUseRouter = useRouter as jest.Mock;

function renderWithStore(store: ReturnType<typeof createTestStore>) {
  return renderHook(() => useVerifyEmail(), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
}

async function settle() {
  await act(async () => {
    await flushPromises();
  });
}

describe('useVerifyEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('redirects to the wizard once both the verification and the autologin succeed', async () => {
    mockUseRouter.mockReturnValue({
      query: { token: 'verif-token', autologinToken: 'auto.token' },
      isReady: true,
    });
    mockedApi.postAuthVerifyEmailToken.mockResolvedValue({} as any);
    mockedApi.postAuthAutologin.mockResolvedValue({
      data: { token: 'session-token' },
    } as any);

    const store = createTestStore();
    const { result, rerender, unmount } = renderWithStore(store);

    // The exchange itself is triggered by the global `useAuthentication`
    // hook (mounted at layout level in production), not by this hook —
    // simulate it by dispatching the same action directly on the store.
    store.dispatch(
      authenticationActions.autologinRequested({ token: 'auto.token' })
    );

    await settle();
    await settle();
    rerender();
    await settle();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.shouldRedirectToWizard).toBe(true);

    unmount();
    await settle();
  });

  it('does not redirect and falls back to the normal display when there is no autologin token', async () => {
    mockUseRouter.mockReturnValue({
      query: { token: 'verif-token' },
      isReady: true,
    });
    mockedApi.postAuthVerifyEmailToken.mockResolvedValue({} as any);

    const store = createTestStore();
    const { result, rerender, unmount } = renderWithStore(store);

    await settle();
    await settle();
    rerender();
    await settle();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.shouldRedirectToWizard).toBe(false);

    unmount();
    await settle();
  });

  it('falls back to the normal display when verification succeeds but autologin fails', async () => {
    mockUseRouter.mockReturnValue({
      query: { token: 'verif-token', autologinToken: 'bad.token' },
      isReady: true,
    });
    mockedApi.postAuthVerifyEmailToken.mockResolvedValue({} as any);
    mockedApi.postAuthAutologin.mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: 'AUTOLOGIN_TOKEN_INVALID' } },
    });

    const store = createTestStore();
    const { result, rerender, unmount } = renderWithStore(store);

    store.dispatch(
      authenticationActions.autologinRequested({ token: 'bad.token' })
    );

    await settle();
    await settle();
    rerender();
    await settle();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.shouldRedirectToWizard).toBe(false);

    unmount();
    await settle();
  });
});
