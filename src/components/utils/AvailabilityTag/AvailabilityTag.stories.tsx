import { Meta, StoryObj } from '@storybook/react';
import { AvailabilityTag } from '.';

const meta = {
  title: 'Availability Tag',
  component: AvailabilityTag,
} satisfies Meta<typeof AvailabilityTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotAvailable = {
  args: {
    isAvailable: false,
  },
} satisfies Story;

export const Available = {
  args: {
    isAvailable: true,
  },
} satisfies Story;
