import React from 'react';
import { NotificationItem } from '@/src/api/types';
import { Button, SimpleLink, Text } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { formatHelpGroupDate } from '@/src/features/backoffice/help-groups/help-groups.labels';
import { useGetNotificationsInfiniteQuery } from '@/src/use-cases/notifications-center';
import {
  getNotificationHref,
  NOTIFICATIONS_LABELS,
} from '../notifications-center.utils';
import {
  StyledNotificationItem,
  StyledNotificationItemContent,
  StyledNotificationsList,
  StyledNotificationsListFooter,
  StyledNotificationsListItems,
  StyledUnseenDot,
} from './NotificationsList.styles';

interface NotificationsListProps {
  // Called when a notification is selected, e.g. to close the panel
  onSelect?: () => void;
}

const NotificationRow = ({
  notification,
  onSelect,
}: {
  notification: NotificationItem;
  onSelect?: () => void;
}) => (
  <StyledNotificationItem
    $isSeen={notification.seen}
    data-testid="notification-item"
    data-seen={notification.seen}
  >
    <SimpleLink href={getNotificationHref(notification)} onClick={onSelect}>
      <StyledUnseenDot $isSeen={notification.seen} aria-hidden="true" />
      <StyledNotificationItemContent>
        {!notification.seen && (
          <Text size="small" color="primaryBlue" weight="semibold">
            {NOTIFICATIONS_LABELS.UNSEEN}
          </Text>
        )}
        <Text weight={notification.seen ? 'normal' : 'semibold'}>
          {notification.label}
        </Text>
        {notification.excerpt && (
          <Text size="small" color="darkGray">
            « {notification.excerpt} »
          </Text>
        )}
        <Text size="small" color="darkGray">
          {notification.context.groupName} ·{' '}
          {formatHelpGroupDate(notification.lastEventAt)}
        </Text>
      </StyledNotificationItemContent>
    </SimpleLink>
  </StyledNotificationItem>
);

/**
 * Notifications of the last 30 days, most recently updated first, loaded by
 * pages. Displaying the list marks nothing as seen: only the display of the
 * announced content does.
 */
export const NotificationsList = ({ onSelect }: NotificationsListProps) => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetNotificationsInfiniteQuery();
  const notifications = data?.pages.flatMap(({ items }) => items) ?? [];

  if (isLoading) {
    return (
      <StyledNotificationsListFooter>
        <Spinner />
      </StyledNotificationsListFooter>
    );
  }
  if (isError) {
    return (
      <StyledNotificationsListFooter>
        <Text color="darkGray">{NOTIFICATIONS_LABELS.LOAD_FAILED}</Text>
      </StyledNotificationsListFooter>
    );
  }
  if (notifications.length === 0) {
    return (
      <StyledNotificationsListFooter data-testid="notifications-empty">
        <Text color="darkGray">{NOTIFICATIONS_LABELS.EMPTY}</Text>
      </StyledNotificationsListFooter>
    );
  }

  return (
    <StyledNotificationsList>
      <StyledNotificationsListItems>
        {notifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            onSelect={onSelect}
          />
        ))}
      </StyledNotificationsListItems>
      {hasNextPage && (
        <StyledNotificationsListFooter>
          <Button
            variant="text"
            size="small"
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
          >
            {NOTIFICATIONS_LABELS.LOAD_MORE}
          </Button>
        </StyledNotificationsListFooter>
      )}
    </StyledNotificationsList>
  );
};
