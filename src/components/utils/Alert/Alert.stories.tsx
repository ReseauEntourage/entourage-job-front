import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Typography } from '../Typography';
import { Alert } from './Alert';
import { AlertProps } from './Alert.types';

const AlertWithContent = ({ variant, closable }: AlertProps) => {
  return (
    <Alert variant={variant} closable={closable}>
      <div>
        <Typography>This is an information</Typography>
      </div>
    </Alert>
  );
};

const meta = {
  title: 'Alert',
  render: AlertWithContent,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    closable: true,
  },
};
