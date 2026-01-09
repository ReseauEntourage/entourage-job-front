import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AvailabilityTag } from '.';

const meta = {
  title: 'Availability Tag',
  component: AvailabilityTag,
  decorators: [
    (Story) => {
      return (
        <div style={{ display: 'flex' }}>
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof AvailabilityTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    isAvailable: true,
  },
} satisfies Story;
