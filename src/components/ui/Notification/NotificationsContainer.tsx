import React from 'react';
import { useSelector } from 'react-redux';
import { selectNotifications } from '@/src/use-cases/notifications';
import {
  StyledNotificationsContainer,
  StyledToastsContainer,
} from './Notification.styles';
import { NotificationWrapper } from './NotificationWrapper';
import { ToastNotification } from './ToastNotification';

export const NotificationsContainer = () => {
  const notifications = useSelector(selectNotifications);

  if (!notifications.length) {
    return null;
  }

  const toasts = notifications.filter(({ variant }) => variant === 'toast');
  const panels = notifications.filter(({ variant }) => variant !== 'toast');

  return (
    <>
      {panels.length > 0 && (
        <StyledNotificationsContainer>
          {panels.map((notification) => (
            <NotificationWrapper
              key={notification.id}
              id={notification.id}
              message={notification.message}
              type={notification.type}
            />
          ))}
        </StyledNotificationsContainer>
      )}
      {toasts.length > 0 && (
        <StyledToastsContainer>
          {toasts.map((notification) => (
            <ToastNotification
              key={notification.id}
              id={notification.id}
              message={notification.message}
              type={notification.type}
            />
          ))}
        </StyledToastsContainer>
      )}
    </>
  );
};
