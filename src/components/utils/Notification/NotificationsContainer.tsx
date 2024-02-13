import React from 'react'
import { Notification, NotificationProps } from './Notification';
import { StyledNotificationsContainer } from './Notification.styles';
import { useSelector } from 'react-redux';
import { selectNotifications } from 'src/use-cases/notifications';

export const NotificationsContainer = ({
    // notifications
}) => {

  const notifications = useSelector(selectNotifications)

  return (
    <StyledNotificationsContainer>
        {
            notifications.map((notification) => (
                <Notification key={notification.id} id={notification.id} message={notification.message}  type={notification.type}/>
            ))
        }
    </StyledNotificationsContainer>
  )
}
