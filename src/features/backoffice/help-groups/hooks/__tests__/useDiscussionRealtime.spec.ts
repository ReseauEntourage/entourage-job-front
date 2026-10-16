import { act, renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  DiscussionRealtimeHandlers,
  REALTIME_FALLBACK_INTERVAL_MS,
  useDiscussionRealtime,
} from '../useDiscussionRealtime';

type Callback = (payload?: unknown) => void;

const channelCallbacks: Record<string, Callback> = {};
const connectionCallbacks: Record<string, Callback> = {};
const mockChannel = {
  bind: jest.fn((event: string, callback: Callback) => {
    channelCallbacks[event] = callback;
  }),
  unbind_all: jest.fn(),
};
const mockPusher = {
  subscribe: jest.fn(() => mockChannel),
  unsubscribe: jest.fn(),
  connection: {
    state: 'connected',
    bind: jest.fn((event: string, callback: Callback) => {
      connectionCallbacks[event] = callback;
    }),
    unbind: jest.fn(),
  },
};

jest.mock('@/src/constants/pusher', () => ({
  ...jest.requireActual('@/src/constants/pusher'),
  getPusher: () => mockPusher,
}));

const buildHandlers = (
  loadedReplyIds: string[] = []
): jest.Mocked<DiscussionRealtimeHandlers> => ({
  isReplyLoaded: jest.fn((id: string) => loadedReplyIds.includes(id)),
  onReplyCreated: jest.fn(),
  onRepliesChanged: jest.fn(),
  onReplyDeleted: jest.fn(),
  onDiscussionChanged: jest.fn(),
  onDiscussionDeleted: jest.fn(),
  onFallbackRefresh: jest.fn(),
});

const emit = (event: string, payload: unknown) =>
  act(() => {
    channelCallbacks[event](payload);
  });

describe('useDiscussionRealtime', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockPusher.connection.state = 'connected';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('subscribes to the private channel of the discussion and unsubscribes on unmount', () => {
    const { unmount } = renderHook(() =>
      useDiscussionRealtime('discussion-1', true, buildHandlers())
    );
    expect(mockPusher.subscribe).toHaveBeenCalledWith(
      'private-post-discussion-1'
    );
    unmount();
    expect(mockPusher.unsubscribe).toHaveBeenCalledWith(
      'private-post-discussion-1'
    );
    expect(mockChannel.unbind_all).toHaveBeenCalled();
  });

  it('does not subscribe while disabled', () => {
    renderHook(() =>
      useDiscussionRealtime('discussion-1', false, buildHandlers())
    );
    expect(mockPusher.subscribe).not.toHaveBeenCalled();
  });

  it('reloads the replies on a reply of someone else, not on one own reply', () => {
    const handlers = buildHandlers(['own-reply']);
    renderHook(() => useDiscussionRealtime('discussion-1', true, handlers));
    emit('reply-created', {
      discussionId: 'discussion-1',
      replyId: 'own-reply',
    });
    expect(handlers.onReplyCreated).not.toHaveBeenCalled();
    emit('reply-created', { discussionId: 'discussion-1', replyId: 'other' });
    expect(handlers.onReplyCreated).toHaveBeenCalledTimes(1);
  });

  it('routes every event type to its handler', () => {
    const handlers = buildHandlers();
    renderHook(() => useDiscussionRealtime('discussion-1', true, handlers));

    emit('reply-updated', { discussionId: 'discussion-1', replyId: 'r1' });
    expect(handlers.onRepliesChanged).toHaveBeenCalledTimes(1);

    emit('reply-deleted', { discussionId: 'discussion-1', replyId: 'r1' });
    expect(handlers.onReplyDeleted).toHaveBeenCalledWith('r1');

    emit('reactions-updated', { discussionId: 'discussion-1', targetId: 'r1' });
    expect(handlers.onRepliesChanged).toHaveBeenCalledTimes(2);

    emit('reactions-updated', {
      discussionId: 'discussion-1',
      targetId: 'discussion-1',
    });
    expect(handlers.onDiscussionChanged).toHaveBeenCalledTimes(1);

    emit('discussion-updated', { discussionId: 'discussion-1' });
    expect(handlers.onDiscussionChanged).toHaveBeenCalledTimes(2);

    emit('discussion-deleted', { discussionId: 'discussion-1' });
    expect(handlers.onDiscussionDeleted).toHaveBeenCalledTimes(1);
  });

  it('refreshes every 30 seconds until the subscription succeeds', () => {
    const handlers = buildHandlers();
    renderHook(() => useDiscussionRealtime('discussion-1', true, handlers));
    act(() => {
      jest.advanceTimersByTime(REALTIME_FALLBACK_INTERVAL_MS);
    });
    expect(handlers.onFallbackRefresh).toHaveBeenCalledTimes(1);

    act(() => {
      channelCallbacks['pusher:subscription_succeeded']();
    });
    act(() => {
      jest.advanceTimersByTime(REALTIME_FALLBACK_INTERVAL_MS * 2);
    });
    expect(handlers.onFallbackRefresh).toHaveBeenCalledTimes(1);
  });

  it('falls back on the periodic refresh when the subscription is refused or the connection lost', () => {
    const handlers = buildHandlers();
    renderHook(() => useDiscussionRealtime('discussion-1', true, handlers));
    act(() => {
      channelCallbacks['pusher:subscription_succeeded']();
    });
    act(() => {
      connectionCallbacks.state_change({ current: 'unavailable' });
    });
    act(() => {
      jest.advanceTimersByTime(REALTIME_FALLBACK_INTERVAL_MS);
    });
    expect(handlers.onFallbackRefresh).toHaveBeenCalledTimes(1);

    act(() => {
      connectionCallbacks.state_change({ current: 'connected' });
      channelCallbacks['pusher:subscription_error']();
    });
    act(() => {
      jest.advanceTimersByTime(REALTIME_FALLBACK_INTERVAL_MS);
    });
    expect(handlers.onFallbackRefresh).toHaveBeenCalledTimes(2);
  });
});
