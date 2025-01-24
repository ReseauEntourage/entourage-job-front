import { Meta, StoryObj } from '@storybook/react';
import { COLORS } from 'src/constants/styles';
import { Text } from './Text';

const meta = {
  title: 'Text',
  component: Text,
  parameters: {
    controls: {
      include: ['color', 'size', 'weight', 'variant'],
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: COLORS,
      defaultValue: 'normal',
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large', 'xlarge', 'xxlarge'],
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
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    color: 'black',
    size: 'normal',
    weight: 'normal',
    variant: 'normal',
  },
} satisfies Story;
