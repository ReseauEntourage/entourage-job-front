import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  getPusher,
  getUserPrivateChannel,
  PUSHER_EVENTS,
} from '@/src/constants/pusher';
import {
  NOTIFICATIONS_CENTER_TAG,
  notificationsCenterApi,
} from './notifications-center.api';

/**
 * Follows the private channel of the logged-in user during the session: the
 * signal carries no content, it only reloads the bell. Unsubscribed as soon
 * as the user logs out (no user id anymore).
 */
export const useNotificationsRealtime = (userId: string | null | undefined) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) {
      return undefined;
    }
    const pusher = getPusher();
    const channelName = getUserPrivateChannel(userId);
    const channel = pusher.subscribe(channelName);
    channel.bind(PUSHER_EVENTS.NOTIFICATIONS_CHANGED, () => {
      dispatch(
        notificationsCenterApi.util.invalidateTags([NOTIFICATIONS_CENTER_TAG])
      );
    });
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [dispatch, userId]);
};
