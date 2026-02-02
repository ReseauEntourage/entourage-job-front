import { Meta, StoryObj } from '@storybook/react';
import { Notification } from './Notification';

const meta = {
  component: Notification,
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessNotification = {
  args: {
    type: 'success',
    message: 'Notification de succès',
  },
} as Story;

export const DangerNotification = {
  args: {
    type: 'danger',
    message: "Notification d'échec",
  },
} as Story;
