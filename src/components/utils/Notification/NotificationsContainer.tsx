import React from 'react'
import { Notification, NotificationProps } from './Notification';
import { StyledNotificationsContainer } from './Notification.styles';

export const NotificationsContainer = ({
    notifications
}: {notifications: (NotificationProps & {id: string;})[]}) => {
  return (
    <StyledNotificationsContainer>
        {
            notifications.map((notification) => (
                <Notification key={notification.id} message={notification.message}  type={notification.type}/>
            ))
        }
    </StyledNotificationsContainer>
  )
}
