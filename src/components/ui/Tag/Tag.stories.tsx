import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Tag, TagSize, TagVariant } from './Tag';

const meta = {
  component: Tag,
  parameters: {
    controls: {
      include: ['size'],
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: Object.values(TagSize),
      defaultValue: 'default',
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
    variant: TagVariant.Default,
    children: 'Default',
  },
} satisfies Story;

export const SecondaryTag = {
  args: {
    variant: TagVariant.Secondary,
    children: 'Secondary',
  },
} satisfies Story;
