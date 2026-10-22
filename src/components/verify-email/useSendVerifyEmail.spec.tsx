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
import { useSendVerifyEmail } from './useSendVerifyEmail';

const mockedApi = getMockedApi();
const mockUseRouter = useRouter as jest.Mock;

function renderWithStore(email?: string) {
  const store = createTestStore();
  return renderHook(() => useSendVerifyEmail(email), {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
}

async function settle() {
  await act(async () => {
    await flushPromises();
  });
}

describe('useSendVerifyEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.postAuthSendVerifyEmail.mockResolvedValue({} as any);
  });

  afterEach(() => {
    cleanup();
  });

  it('sends the verification email with the token from the URL', async () => {
    mockUseRouter.mockReturnValue({ query: { token: 'abc' }, isReady: true });
    const { result } = renderWithStore('a@b.fr');
    act(() => result.current.sendVerifyEmail());
    await settle();
    expect(mockedApi.postAuthSendVerifyEmail).toHaveBeenCalledWith({
      token: 'abc',
    });
  });

  it('falls back to the email when there is no token', async () => {
    mockUseRouter.mockReturnValue({ query: {}, isReady: true });
    const { result } = renderWithStore('a@b.fr');
    act(() => result.current.sendVerifyEmail());
    await settle();
    expect(mockedApi.postAuthSendVerifyEmail).toHaveBeenCalledWith({
      email: 'a@b.fr',
    });
  });

  it('does nothing when neither token nor email is available', async () => {
    mockUseRouter.mockReturnValue({ query: {}, isReady: true });
    const { result } = renderWithStore();
    act(() => result.current.sendVerifyEmail());
    await settle();
    expect(mockedApi.postAuthSendVerifyEmail).not.toHaveBeenCalled();
  });

  it('does nothing while the router is not ready', async () => {
    mockUseRouter.mockReturnValue({ query: { token: 'abc' }, isReady: false });
    const { result } = renderWithStore('a@b.fr');
    act(() => result.current.sendVerifyEmail());
    await settle();
    expect(mockedApi.postAuthSendVerifyEmail).not.toHaveBeenCalled();
  });
});
