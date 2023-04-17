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
              args.color === 'white' ? COLORS.darkerBlack : 'transparent',
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

export function SecondaryInvertedOrange() {
  return (
    <Button style="custom-secondary-inverted" color="primaryOrange">
      Button
    </Button>
  );
}

export default meta;
