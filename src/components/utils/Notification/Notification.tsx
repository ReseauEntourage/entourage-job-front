import React from 'react';
import { LucidIcon } from '../Icons/LucidIcon';
import {
  StyledFailedNotification,
  StyledSuccessNotification,
} from './Notification.styles';

interface NotificationProps {
  type: 'success' | 'danger';
  message: string;
}
export const Notification = ({ type, message }: NotificationProps) => {
  return (
    <>
      {type === 'success' ? (
        <StyledSuccessNotification>
          <LucidIcon name="Check" />
          {message}
        </StyledSuccessNotification>
      ) : (
        <StyledFailedNotification>
          <LucidIcon name="X" />
          {message}
        </StyledFailedNotification>
      )}
    </>
  );
};
