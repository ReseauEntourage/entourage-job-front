import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { conversationHasUnreadMessages } from 'src/features/backoffice/messaging/messaging.utils';
import { NotifBadges } from '@/src/features/navs/NavConnected/NavConnected.types';
import {
  selectConversations,
  selectUnseenConversationCount,
} from 'src/use-cases/messaging';
import { selectCurrentUserId } from 'src/use-cases/current-user';

export function useNotifBadges() {
  const [badges, setBadges] = useState<NotifBadges>({
    messaging: 0,
  });
  const unseenConversationCount = useSelector(selectUnseenConversationCount);
  const conversations = useSelector(selectConversations);
  const currentUserId = useSelector(selectCurrentUserId);

  useEffect(() => {
    let messagingCount: number;
    if (conversations !== null && currentUserId) {
      messagingCount = conversations.filter((conversation) =>
        conversationHasUnreadMessages(conversation, currentUserId)
      ).length;
    } else {
      messagingCount = unseenConversationCount;
    }
    setBadges((prevBadges) => ({
      ...prevBadges,
      messaging: messagingCount,
    }));
  }, [unseenConversationCount, conversations, currentUserId]);

  return badges;
}
