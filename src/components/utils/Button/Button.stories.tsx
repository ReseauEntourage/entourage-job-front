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
      options: ['primaryBlue', 'darkGray'],
      defaultValue: 'primaryBlue',
    },
    size: {
      control: 'select',
      options: ['large', 'small'],
      defaultValue: 'large',
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
            backgroundColor:
              args.color === 'white' ? COLORS.black : 'transparent',
            display: 'flex',
            padding: 8,
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
      options: ['primaryBlue', 'darkGray', 'white'],
      defaultValue: 'primaryBlue',
    },
  },
};

export const Secondary = {
  args: {
    style: 'custom-secondary',
  },
};

export const SecondaryInverted = {
  args: {
    style: 'custom-secondary-inverted',
  },
};

export const Text = {
  args: {
    style: 'custom-text',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['primaryBlue', 'black'],
      defaultValue: 'primaryBlue',
    },
  },
};

export default meta;
