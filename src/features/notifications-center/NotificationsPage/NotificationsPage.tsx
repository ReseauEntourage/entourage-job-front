import React from 'react';
import { Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { useGetNotificationsUnseenCountQuery } from '@/src/use-cases/notifications-center';
import { MarkAllSeenButton } from '../MarkAllSeenButton';
import { NotificationsList } from '../NotificationsList';
import { NOTIFICATIONS_LABELS } from '../notifications-center.utils';
import { StyledNotificationsPageHeader } from './NotificationsPage.styles';

/**
 * Full screen list of the bell, on mobile.
 */
export const NotificationsPage = () => {
  const { data: unseenCount = 0 } = useGetNotificationsUnseenCountQuery();

  return (
    <Section className="custom-page">
      <StyledNotificationsPageHeader>
        <H2 title={NOTIFICATIONS_LABELS.TITLE} />
        <MarkAllSeenButton unseenCount={unseenCount} />
      </StyledNotificationsPageHeader>
      <NotificationsList />
    </Section>
  );
};
