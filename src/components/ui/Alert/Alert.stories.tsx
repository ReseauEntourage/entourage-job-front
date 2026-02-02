import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Alert } from './Alert';
import { AlertProps, AlertVariant } from './Alert.types';

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
      options: Object.values(AlertVariant),
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: AlertVariant.Info,
    closable: true,
  },
};
