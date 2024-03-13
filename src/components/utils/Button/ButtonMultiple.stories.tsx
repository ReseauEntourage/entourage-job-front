import React from 'react';
import { COLORS } from 'src/constants/styles';

import { ButtonMultiple } from './ButtonMultiple';

const meta = {
  title: 'ButtonMultiple',
  component: ButtonMultiple,
  parameters: {
    controls: {
      include: ['color', 'size', 'disabled', 'align'],
    },
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'right'],
      defaultValue: 'left',
    },
    color: {
      control: 'select',
      options: ['primaryBlue', 'darkGrayFont'],
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
    id: 'button-multiple-stories',
    buttons: [
      {
        onClick: () => {
          return null;
        },
        label: 'Action 1',
      },
      {
        onClick: () => {
          return null;
        },
        label: 'Action 2',
      },
    ],
    children: 'Button Multiple',
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
      options: ['primaryBlue', 'darkGrayFont', 'white'],
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
