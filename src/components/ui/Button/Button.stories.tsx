import type { Meta, StoryObj } from '@storybook/react';
import { LucidIcon } from '../Icons/LucidIcon';
import { Button } from './Button';

const meta = {
  component: Button,
  parameters: {
    controls: {
      include: [
        'children',
        'variant',
        'size',
        'disabled',
        'rounded',
        'href',
        'isExternal',
        'newTab',
        'shallow',
        'scroll',
        'className',
        'dataTestId',
      ],
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    disabled: false,
    size: 'medium',
    rounded: true,
    href: undefined,
    isExternal: false,
    newTab: false,
    shallow: false,
    scroll: true,
    className: '',
    dataTestId: '',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'text'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    rounded: {
      control: 'boolean',
    },
    href: {
      control: 'text',
    },
    isExternal: {
      control: 'boolean',
    },
    newTab: {
      control: 'boolean',
    },
    shallow: {
      control: 'boolean',
    },
    scroll: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
    dataTestId: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Rounded: Story = {
  args: {
    rounded: true,
  },
};

export const Circle: Story = {
  args: {
    rounded: 'circle',
    children: <LucidIcon name="Plus" size={40} />,
  },
};
