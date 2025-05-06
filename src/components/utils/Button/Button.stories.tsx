import { Meta } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    controls: { include: ['rounded'] },
  },
  args: {
    children: 'Button',
  },
  argTypes: {
    rounded: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

export default meta;

export const Default = {
  args: {
    variant: 'default',
  },
};

export const Primary = {
  args: {
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
  },
};
