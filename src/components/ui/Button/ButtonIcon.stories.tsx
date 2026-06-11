import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { ButtonIcon, ButtonIconProps } from './ButtonIcon';

const meta = {
  component: ButtonIcon,
  render: ({ href, variant }: ButtonIconProps) => {
    return (
      <>
        Bouton vers : {href}
        <ButtonIcon
          icon={<SvgIcon name="IlluConversation" />}
          href={href}
          variant={variant}
        />
      </>
    );
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof ButtonIcon>;

export const Text: Story = {
  args: {
    href: 'https://www.entourage.social/',
    variant: 'text',
  },
};

export const Default: Story = {
  args: {
    href: 'https://www.entourage.social/',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    href: 'https://www.entourage.social/',
    variant: 'secondary',
  },
};
