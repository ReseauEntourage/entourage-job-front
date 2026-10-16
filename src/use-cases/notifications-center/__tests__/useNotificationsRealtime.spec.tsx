jest.mock('@/src/api');

import { act, renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { useGetNotificationsUnseenCountQuery } from '../notifications-center.api';
import { useNotificationsRealtime } from '../useNotificationsRealtime';

type Callback = () => void;

const channelCallbacks: Record<string, Callback> = {};
const mockChannel = {
  bind: jest.fn((event: string, callback: Callback) => {
    channelCallbacks[event] = callback;
  }),
  unbind_all: jest.fn(),
};
const mockPusher = {
  subscribe: jest.fn(() => mockChannel),
  unsubscribe: jest.fn(),
};

jest.mock('@/src/constants/pusher', () => ({
  ...jest.requireActual('@/src/constants/pusher'),
  getPusher: () => mockPusher,
}));

const mockedApi = getMockedApi();

const renderRealtime = (initialUserId: string | null) => {
  const store = createTestStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return renderHook(
    ({ userId }: { userId: string | null }) => {
      useNotificationsRealtime(userId);
      return useGetNotificationsUnseenCountQuery();
    },
    { wrapper, initialProps: { userId: initialUserId } }
  );
};

describe('useNotificationsRealtime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedApi.getNotificationsUnseenCount.mockResolvedValue({
      data: { count: 1 },
    } as never);
  });

  it('subscribes to the private channel of the user', () => {
    renderRealtime('user-1');
    expect(mockPusher.subscribe).toHaveBeenCalledWith('private-user-user-1');
  });

  it('reloads the bell on the signal, which carries no content', async () => {
    const { result } = renderRealtime('user-1');
    await waitFor(() => expect(result.current.data).toBe(1));
    expect(mockedApi.getNotificationsUnseenCount).toHaveBeenCalledTimes(1);

    mockedApi.getNotificationsUnseenCount.mockResolvedValue({
      data: { count: 2 },
    } as never);
    act(() => {
      channelCallbacks['notifications-changed']();
    });
    await waitFor(() => expect(result.current.data).toBe(2));
    expect(mockedApi.getNotificationsUnseenCount).toHaveBeenCalledTimes(2);
  });

  it('unsubscribes at logout and on unmount', () => {
    const { rerender, unmount } = renderRealtime('user-1');
    rerender({ userId: null });
    expect(mockPusher.unsubscribe).toHaveBeenCalledWith('private-user-user-1');
    expect(mockChannel.unbind_all).toHaveBeenCalled();

    rerender({ userId: 'user-2' });
    unmount();
    expect(mockPusher.unsubscribe).toHaveBeenCalledWith('private-user-user-2');
  });

  it('subscribes to nothing without a logged-in user', () => {
    renderRealtime(null);
    expect(mockPusher.subscribe).not.toHaveBeenCalled();
  });
});
