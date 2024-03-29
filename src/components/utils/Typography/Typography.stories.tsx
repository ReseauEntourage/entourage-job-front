import { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta = {
  title: 'Typography',
  component: Typography,
  parameters: {
    controls: {
      include: ['color', 'size', 'weight', 'variant'],
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['lighter', 'light', 'normal'],
      defaultValue: 'normal',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      defaultValue: 'normal',
    },
    weight: {
      control: 'select',
      options: ['normal', 'bold'],
      defaultValue: 'normal',
    },
    variant: {
      control: 'select',
      options: ['normal', 'italic'],
      defaultValue: 'normal',
    },
  },
  args: {
    children: 'This is an example text',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    color: 'normal',
    size: 'normal',
    weight: 'normal',
    variant: 'normal',
  },
} satisfies Story;
