import React from 'react';
import { Check, Close } from 'assets/icons/icons';
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
          <Check />
          {message}
        </StyledSuccessNotification>
      ) : (
        <StyledFailedNotification>
          <Close />
          {message}
        </StyledFailedNotification>
      )}
    </>
  );
};
