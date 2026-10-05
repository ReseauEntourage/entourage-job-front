import React from 'react';
import { Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { NotificationsList } from '../NotificationsList';
import { NOTIFICATIONS_LABELS } from '../notifications-center.utils';

/**
 * Full screen list of the bell, on mobile.
 */
export const NotificationsPage = () => (
  <Section className="custom-page">
    <H2 title={NOTIFICATIONS_LABELS.TITLE} />
    <NotificationsList />
  </Section>
);
