import React from 'react';
import { useSelector } from 'react-redux';
import { selectNotifications } from 'src/use-cases/notifications';
import { StyledNotificationsContainer } from './Notification.styles';
import { NotificationWrapper } from './NotificationWrapper';

export const NotificationsContainer = () => {
  const notifications = useSelector(selectNotifications);

  return (
    <StyledNotificationsContainer>
      {notifications.map((notification) => (
        <NotificationWrapper
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </StyledNotificationsContainer>
  );
};
