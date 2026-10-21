import { renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import {
  useSelectedProfile,
  useSelectSelectedProfile,
} from './useSelectedProfile';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/api');

const setup = <T,>(hook: () => T, store = createTestStore()) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return { store, ...renderHook(hook, { wrapper }) };
};

describe('useSelectedProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not fetch without user id', () => {
    (useRouter as jest.Mock).mockReturnValue({ query: {} });
    setup(() => useSelectedProfile());
    expect(Api.getPublicUserProfile).not.toHaveBeenCalled();
  });

  it('fetches the profile of the URL user and exposes it', async () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { userId: 'u-1' } });
    (Api.getPublicUserProfile as jest.Mock).mockResolvedValue({
      data: { id: 'u-1', firstName: 'Awa' },
    });
    const { result } = setup(() => useSelectedProfile());
    await waitFor(() =>
      expect(result.current.selectedProfile).toMatchObject({ firstName: 'Awa' })
    );
    expect(Api.getPublicUserProfile).toHaveBeenCalledWith('u-1');
  });

  it('notifies the user when the fetch fails', async () => {
    (useRouter as jest.Mock).mockReturnValue({ query: { userId: 'u-1' } });
    (Api.getPublicUserProfile as jest.Mock).mockRejectedValue(new Error('x'));
    const { store } = setup(() => useSelectedProfile());
    await waitFor(() =>
      expect(store.getState().notifications.notifications).toHaveLength(1)
    );
    expect(store.getState().notifications.notifications[0].message).toBe(
      'Une erreur est survenue'
    );
  });
});

describe('useSelectSelectedProfile', () => {
  it('throws when no profile is selected', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => setup(() => useSelectSelectedProfile())).toThrow(
      'No selected profile'
    );
  });
});
