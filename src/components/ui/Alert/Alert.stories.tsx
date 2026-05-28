import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert } from './Alert';
import { AlertProps, AlertType } from './Alert.types';

const AlertWithContent = ({ variant, closable }: AlertProps) => {
  return (
    <Alert variant={variant} closable={closable}>
      This is an information
    </Alert>
  );
};

const meta = {
  component: Alert,
  render: AlertWithContent,
  argTypes: {
    variant: {
      options: ['outlined', 'filled'],
      control: { type: 'radio' },
    },
    type: {
      options: [
        AlertType.Info,
        AlertType.Success,
        AlertType.Error,
        AlertType.Warning,
      ],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'filled',
    type: AlertType.Info,
    closable: true,
  },
};
