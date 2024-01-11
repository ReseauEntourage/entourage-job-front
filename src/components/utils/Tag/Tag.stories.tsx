import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tag } from './Tag';

const meta = {
  title: 'Tag',
  component: Tag,
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
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTag = {
  args: {
    content: 'Hello',
  },
} satisfies Story;

export const SecondaryTag = {
  args: {
    content: 'Hello',
    style: 'secondary',
  },
} satisfies Story;
