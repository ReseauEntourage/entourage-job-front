import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { NotifBadges } from '@/src/features/navs/NavConnected/NavConnected.types';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { selectUnseenConversationCount } from '@/src/use-cases/messaging';
import { useGetNotificationsUnseenCountQuery } from '@/src/use-cases/notifications-center';
import { useGetAdminReportsPendingCountQuery } from '@/src/use-cases/reports';

export function useNotifBadges() {
  const [badges, setBadges] = useState<NotifBadges>({
    messaging: 0,
    notifications: 0,
    reports: 0,
  });
  const unseenConversationCount = useSelector(selectUnseenConversationCount);
  const user = useAuthenticatedUser();
  // Read at load, then refreshed by the Pusher signal of the user channel
  const { data: unseenNotificationsCount = 0 } =
    useGetNotificationsUnseenCountQuery(undefined, { skip: !user });

  // Admins only, in their zone (every zone without one): read at load, then
  // refreshed after a closing, without dedicated polling
  const { data: pendingReportsCount = 0 } = useGetAdminReportsPendingCountQuery(
    user?.zone ?? null,
    {
      skip: user?.role !== UserRoles.ADMIN,
    }
  );

  useEffect(() => {
    setBadges((prevBadges) => {
      return {
        ...prevBadges,
        messaging: unseenConversationCount,
        notifications: unseenNotificationsCount,
        reports: pendingReportsCount,
      };
    });
  }, [unseenConversationCount, unseenNotificationsCount, pendingReportsCount]);

  return badges;
}
