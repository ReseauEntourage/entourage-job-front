import { useEffect, useRef, useState } from 'react';
import {
  getPostPrivateChannel,
  getPusher,
  PostRealtimePayload,
  PUSHER_EVENTS,
} from '@/src/constants/pusher';

// Same value as DELAY_REFRESH_CONVERSATIONS of the messaging
export const REALTIME_FALLBACK_INTERVAL_MS = 30000;

export interface DiscussionRealtimeHandlers {
  // Own replies are already in the thread: their event is ignored
  isReplyLoaded: (replyId: string) => boolean;
  onReplyCreated: () => void;
  onRepliesChanged: () => void;
  onReplyDeleted: (replyId: string) => void;
  onDiscussionChanged: () => void;
  onDiscussionDeleted: () => void;
  // Periodic refresh while the realtime connection is unavailable
  onFallbackRefresh: () => void;
}

/**
 * Follows the private channel of the open discussion. The events only carry
 * ids: each one reloads (or removes) what changed, never touching the text
 * being written. While Pusher is not connected, or the subscription was
 * refused, the thread is refreshed every 30 seconds instead.
 */
export const useDiscussionRealtime = (
  discussionId: string,
  enabled: boolean,
  handlers: DiscussionRealtimeHandlers
) => {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const [isConnected, setIsConnected] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!enabled || !discussionId) {
      return undefined;
    }
    const pusher = getPusher();
    const channelName = getPostPrivateChannel(discussionId);
    const channel = pusher.subscribe(channelName);

    const onStateChange = ({ current }: { current: string }) =>
      setIsConnected(current === 'connected');
    setIsConnected(pusher.connection?.state === 'connected');
    pusher.connection?.bind('state_change', onStateChange);

    channel.bind('pusher:subscription_succeeded', () => setIsSubscribed(true));
    channel.bind('pusher:subscription_error', () => setIsSubscribed(false));

    channel.bind(
      PUSHER_EVENTS.REPLY_CREATED,
      ({ replyId }: PostRealtimePayload) => {
        if (!replyId || !handlersRef.current.isReplyLoaded(replyId)) {
          handlersRef.current.onReplyCreated();
        }
      }
    );
    channel.bind(PUSHER_EVENTS.REPLY_UPDATED, () =>
      handlersRef.current.onRepliesChanged()
    );
    channel.bind(
      PUSHER_EVENTS.REPLY_DELETED,
      ({ replyId }: PostRealtimePayload) => {
        if (replyId) {
          handlersRef.current.onReplyDeleted(replyId);
        }
      }
    );
    channel.bind(
      PUSHER_EVENTS.REACTIONS_UPDATED,
      ({ targetId }: PostRealtimePayload) => {
        if (targetId === discussionId) {
          handlersRef.current.onDiscussionChanged();
        } else {
          handlersRef.current.onRepliesChanged();
        }
      }
    );
    channel.bind(PUSHER_EVENTS.DISCUSSION_UPDATED, () =>
      handlersRef.current.onDiscussionChanged()
    );
    channel.bind(PUSHER_EVENTS.DISCUSSION_DELETED, () =>
      handlersRef.current.onDiscussionDeleted()
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.connection?.unbind('state_change', onStateChange);
      setIsSubscribed(false);
    };
  }, [discussionId, enabled]);

  const isLive = isConnected && isSubscribed;

  useEffect(() => {
    if (!enabled || isLive) {
      return undefined;
    }
    const interval = setInterval(
      () => handlersRef.current.onFallbackRefresh(),
      REALTIME_FALLBACK_INTERVAL_MS
    );
    return () => clearInterval(interval);
  }, [enabled, isLive]);

  return { isLive };
};
