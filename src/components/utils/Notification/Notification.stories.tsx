import React from 'react';
import { Notification } from './Notification';

const meta = {
  title: 'Notification',
  component: Notification,
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
  return <Notification type="success" message="Notification de succès" />;
};

export const NotificationDeSuccès = {
  render: SuccessNotificationTemplate,
};

const DangerNotificationTemplate = () => {
  return <Notification type="danger" message="Notification d'échec" />;
};

export const NotificationDEchec = {
  render: DangerNotificationTemplate,
};

export default meta;
