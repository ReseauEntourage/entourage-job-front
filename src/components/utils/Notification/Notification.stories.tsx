import React from 'react';
import { Check, Close } from 'assets/icons/icons';
import {
  StyledSuccessNotification,
  StyledFailedNotification,
} from './Notification.styles';

const meta = {
  title: 'Notification',
  component: 'Notification',
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const SuccessNotificationTemplate = () => {
  return (
    <StyledSuccessNotification>
      <Check />
      Notification de succès
    </StyledSuccessNotification>
  );
};

export const NotificationDeSuccès = {
  render: SuccessNotificationTemplate,
};

const DangerNotificationTemplate = () => {
  return (
    <StyledFailedNotification>
      <Close />
      Notification d&lsquo;échec
    </StyledFailedNotification>
  );
};

export const NotificationDEchec = {
  render: DangerNotificationTemplate,
};

export default meta;
