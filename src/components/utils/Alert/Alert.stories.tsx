import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Typography } from '../Typography';
import { Alert } from './Alert';
import { AlertProps } from './Alert.types';

const AlertContent = () => {
  return <Typography>This is an information</Typography>;
};

const AlertWithContent = ({ variant }: AlertProps) => {
  return (
    <Alert variant={variant}>
      <AlertContent />
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
  },
};
