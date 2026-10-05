import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NotifBadges } from '@/src/features/navs/NavConnected/NavConnected.types';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { selectUnseenConversationCount } from '@/src/use-cases/messaging';
import { useGetNotificationsUnseenCountQuery } from '@/src/use-cases/notifications-center';

export function useNotifBadges() {
  const [badges, setBadges] = useState<NotifBadges>({
    messaging: 0,
    notifications: 0,
  });
  const unseenConversationCount = useSelector(selectUnseenConversationCount);
  const user = useAuthenticatedUser();
  // Read at load, then refreshed by the Pusher signal of the user channel
  const { data: unseenNotificationsCount = 0 } =
    useGetNotificationsUnseenCountQuery(undefined, { skip: !user });

  useEffect(() => {
    setBadges((prevBadges) => {
      return {
        ...prevBadges,
        messaging: unseenConversationCount,
        notifications: unseenNotificationsCount,
      };
    });
  }, [unseenConversationCount, unseenNotificationsCount]);

  return badges;
}
