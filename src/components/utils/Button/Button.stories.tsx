import React from 'react';
import { COLORS } from 'src/constants/styles';

import { Button } from './Button';

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    controls: {
      include: ['color', 'size', 'disabled'],
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primaryOrange', 'darkGrayFont'],
      defaultValue: 'primaryOrange',
    },
    size: {
      control: 'select',
      options: ['normal', 'small'],
      defaultValue: 'normal',
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
  },
  args: {
    children: 'Button',
  },
  decorators: [
    (Story, { args }) => {
      return (
        <div
          style={{
            display: 'flex',
            padding: 8,
            backgroundColor:
              args.color === 'white' ? COLORS.darkerBlack : 'transparent',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export const Primary = {
  args: {
    style: 'custom-primary',
  },
};

export const PrimaryInverted = {
  args: {
    style: 'custom-primary-inverted',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primaryOrange', 'darkGrayFont', 'white'],
      defaultValue: 'primaryOrange',
    },
  },
};

export const Secondary = {
  args: {
    style: 'custom-secondary',
  },
};
export const Text = {
  args: {
    style: 'custom-text',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primaryOrange', 'black'],
      defaultValue: 'primaryOrange',
    },
  },
};

export default meta;
