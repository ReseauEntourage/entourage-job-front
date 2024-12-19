import React from 'react';
import { LucidIcon } from '../Icons/LucidIcon';
import { Text } from '../Text';
import {
  StyledIconContainer,
  StyledNotification,
  StyledTextContainer,
} from './Notification.styles';

interface NotificationProps {
  type: 'success' | 'danger';
  message: string;
}
export const Notification = ({ type, message }: NotificationProps) => {
  return (
    <StyledNotification type={type}>
      <StyledIconContainer>
        <LucidIcon name="CircleCheck" size={100} />
      </StyledIconContainer>

      <StyledTextContainer>
        <Text color="white" size="large">
          {message}
        </Text>
      </StyledTextContainer>
    </StyledNotification>
  );
};
