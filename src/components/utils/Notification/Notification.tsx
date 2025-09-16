import React, { useMemo } from 'react';
import { IconName, LucidIcon } from '../Icons/LucidIcon';
import { Text } from '../Text';
import { StyledNotification, StyledTextContainer } from './Notification.styles';

interface NotificationProps {
  type: 'success' | 'danger';
  message: string;
}
export const Notification = ({ type, message }: NotificationProps) => {
  const iconName: IconName = useMemo(() => {
    if (type === 'danger') return 'CircleX';
    return 'CircleCheck';
  }, [type]);

  return (
    <StyledNotification type={type}>
      <LucidIcon name={iconName} size={20} />

      <StyledTextContainer>
        <Text color="white">{message}</Text>
      </StyledTextContainer>
    </StyledNotification>
  );
};
