import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { ButtonIcon, ButtonIconProps } from './ButtonIcon';

const meta = {
  component: ButtonIcon,
  render: ({ href }: ButtonIconProps) => {
    return (
      <>
        Bouton vers : {href}
        <ButtonIcon icon={<SvgIcon name="IlluConversation" />} href={href} />
      </>
    );
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof ButtonIcon>;

export const Default: Story = {
  args: {
    href: 'https://www.entourage.social/',
  },
};
