import React from 'react';
import { Button } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { useMarkAllNotificationsSeenMutation } from '@/src/use-cases/notifications-center';
import { NOTIFICATIONS_LABELS } from '../notifications-center.utils';

interface MarkAllSeenButtonProps {
  // Number of unseen notifications: disabled when there is nothing to mark
  unseenCount: number;
}

/**
 * « Tout marquer comme lu »: marks every notification seen at once, without
 * confirmation. The bell and the list reload through the invalidated tag.
 */
export const MarkAllSeenButton = ({ unseenCount }: MarkAllSeenButtonProps) => {
  const [markAllSeen, { isLoading }] = useMarkAllNotificationsSeenMutation();
  const hasUnseen = unseenCount > 0;

  return (
    <Button
      variant="text"
      size="small"
      weight="semibold"
      dataTestId="notifications-mark-all-seen"
      disabled={!hasUnseen || isLoading}
      prependIcon={<LucidIcon name="CheckCheck" stroke="bold" />}
      onClick={() => {
        markAllSeen();
      }}
    >
      {hasUnseen
        ? NOTIFICATIONS_LABELS.MARK_ALL_SEEN
        : NOTIFICATIONS_LABELS.ALL_SEEN}
    </Button>
  );
};
