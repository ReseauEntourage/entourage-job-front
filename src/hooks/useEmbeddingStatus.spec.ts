import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { PUSHER_CHANNELS, PUSHER_EVENTS } from '@/src/constants';
import { useAuthenticatedUser } from './authentication/useAuthenticatedUser';
import { useEmbeddingStatus } from './useEmbeddingStatus';

const mockChannel = { bind: jest.fn(), unbind: jest.fn() };
const mockPusher = {
  subscribe: jest.fn(() => mockChannel),
  unsubscribe: jest.fn(),
};

jest.mock('@/src/constants', () => ({
  ...jest.requireActual('@/src/constants'),
  getPusher: () => mockPusher,
}));
jest.mock('./authentication/useAuthenticatedUser', () => ({
  useAuthenticatedUser: jest.fn(),
}));

const mockUseAuthenticatedUser = useAuthenticatedUser as jest.Mock;

describe('useEmbeddingStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthenticatedUser.mockReturnValue({ id: 'u1' });
  });

  it('subscribes to the user embedding channel and calls onReady on the ready event', () => {
    const onReady = jest.fn();
    renderHook(() => useEmbeddingStatus({ onReady }));

    expect(mockPusher.subscribe).toHaveBeenCalledWith(
      `${PUSHER_CHANNELS.EMBEDDING}-u1`
    );
    expect(mockChannel.bind).toHaveBeenCalledWith(
      PUSHER_EVENTS.EMBEDDING_READY,
      expect.any(Function)
    );

    mockChannel.bind.mock.calls[0][1]();
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('unbinds and unsubscribes on unmount', () => {
    const { unmount } = renderHook(() =>
      useEmbeddingStatus({ onReady: jest.fn() })
    );
    unmount();

    expect(mockChannel.unbind).toHaveBeenCalledWith(
      PUSHER_EVENTS.EMBEDDING_READY
    );
    expect(mockPusher.unsubscribe).toHaveBeenCalledWith(
      `${PUSHER_CHANNELS.EMBEDDING}-u1`
    );
  });

  it('does nothing when disabled', () => {
    renderHook(() =>
      useEmbeddingStatus({ onReady: jest.fn(), enabled: false })
    );
    expect(mockPusher.subscribe).not.toHaveBeenCalled();
  });

  it('does nothing without a user id', () => {
    mockUseAuthenticatedUser.mockReturnValue({});
    renderHook(() => useEmbeddingStatus({ onReady: jest.fn() }));
    expect(mockPusher.subscribe).not.toHaveBeenCalled();
  });
});
