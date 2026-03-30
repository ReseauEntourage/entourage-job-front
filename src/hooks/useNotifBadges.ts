import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NotifBadges } from '@/src/features/navs/NavConnected/NavConnected.types';
import { selectUnseenConversationCount } from 'src/use-cases/messaging';

export function useNotifBadges() {
  const [badges, setBadges] = useState<NotifBadges>({
    messaging: 0,
  });
  const unseenConversationCount = useSelector(selectUnseenConversationCount);

  useEffect(() => {
    setBadges((prevBadges) => {
      return {
        ...prevBadges,
        messaging: unseenConversationCount,
      };
    });
  }, [unseenConversationCount]);

  return badges;
}
