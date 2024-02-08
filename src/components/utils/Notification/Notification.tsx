import React from 'react'
import { StyledNotification } from './Notification.styles';

interface NotificationProps {
    type: 'success' | 'danger';
    message: string;
}

export const Notification = ({
    type,
    message
}: NotificationProps) => {
  return (
    <StyledNotification>{message}</StyledNotification>
  )
}
