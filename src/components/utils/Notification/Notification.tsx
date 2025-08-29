import React from 'react';
import { LucidIcon } from '../Icons/LucidIcon';
import { Text } from '../Text';
import { StyledNotification, StyledTextContainer } from './Notification.styles';

interface NotificationProps {
  type: 'success' | 'danger';
  message: string;
}
export const Notification = ({ type, message }: NotificationProps) => {
  return (
    <StyledNotification type={type}>
      <LucidIcon name="CircleCheck" size={20} />

      <StyledTextContainer>
        <Text color="white">{message}</Text>
      </StyledTextContainer>
    </StyledNotification>
  );
};
