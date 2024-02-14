import React from 'react';
import { useSelector } from 'react-redux';
import { selectNotifications } from 'src/use-cases/notifications';
import { Notification } from './Notification';
import { StyledNotificationsContainer } from './Notification.styles';

export const NotificationsContainer = () => {
  const notifications = useSelector(selectNotifications);

  return (
    <StyledNotificationsContainer>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
        />
      ))}
    </StyledNotificationsContainer>
  );
};
