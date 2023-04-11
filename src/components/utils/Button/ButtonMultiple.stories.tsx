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
