import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { COLORS } from 'src/constants/styles';
import { Spinner } from './Spinner';

const meta = {
  title: 'Spinner',
  component: Spinner,
  parameters: {
    controls: {
      include: ['color'],
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: [COLORS.primaryBlue, COLORS.white],
      defaultValue: COLORS.primaryBlue,
    },
  },
  decorators: [
    (Story, { args }) => {
      return (
        <div
          style={{
            backgroundColor:
              args.color === COLORS.white ? COLORS.primaryBlue : 'transparent',
            display: 'flex',
            padding: 8,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    color: COLORS.primaryBlue,
  },
} satisfies Story;
