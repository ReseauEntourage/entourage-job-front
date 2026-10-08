import { NotificationItem } from '@/src/api/types';

// Beyond this, the badge reads "9+"
export const UNSEEN_BADGE_MAX = 9;

export const formatUnseenBadge = (count: number): string | null =>
  count <= 0
    ? null
    : count > UNSEEN_BADGE_MAX
      ? `${UNSEEN_BADGE_MAX}+`
      : String(count);

/**
 * Accessible name of the bell, with the unseen count of the badge (which is
 * hidden from screen readers), e.g. "Notifications, 2 non vues".
 */
export const getBellLabel = (count: number): string => {
  const badge = formatUnseenBadge(count);
  if (!badge) {
    return NOTIFICATIONS_LABELS.BELL;
  }
  return `${NOTIFICATIONS_LABELS.BELL}, ${badge} ${
    count > 1 ? 'non vues' : 'non vue'
  }`;
};

// Page of the bell on mobile, where the list opens full screen
export const NOTIFICATIONS_PAGE_HREF = '/backoffice/notifications';

/**
 * The discussion, positioned on the first unseen reply or on the reacted
 * message.
 */
export const getNotificationHref = ({ destination }: NotificationItem) =>
  `/backoffice/groupes/${destination.slug}/discussions/${destination.discussionId}${
    destination.replyId ? `?replyId=${destination.replyId}` : ''
  }`;

export const NOTIFICATIONS_LABELS = {
  TITLE: 'Notifications',
  BELL: 'Notifications',
  // Neutral: neither a "0" nor an absence of activity
  EMPTY:
    'Quand quelqu’un vous répond ou soutient votre message, vous le retrouvez ici.',
  LOAD_MORE: 'Voir plus',
  LOAD_FAILED: 'Les notifications n’ont pas pu être chargées.',
  UNSEEN: 'Nouveau',
  MARK_ALL_SEEN: 'Tout marquer comme lu',
  ALL_SEEN: 'Tout est lu',
};
