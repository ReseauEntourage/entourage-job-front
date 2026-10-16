import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { NotificationsPage } from '@/src/features/notifications-center/NotificationsPage';

// The bell on mobile: the list opens full screen
const Notifications = () => {
  return (
    <LayoutBackOffice title="Notifications">
      <NotificationsPage />
    </LayoutBackOffice>
  );
};

export default Notifications;
