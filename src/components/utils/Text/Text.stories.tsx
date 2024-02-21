import { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Text',
  component: Text,
  parameters: {
    controls: {
      include: ['color', 'size', 'weight'],
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
  },
  args: {
    children: 'This is an example text',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    color: 'normal',
    size: 'normal',
    weight: 'normal',
  },
} satisfies Story;
