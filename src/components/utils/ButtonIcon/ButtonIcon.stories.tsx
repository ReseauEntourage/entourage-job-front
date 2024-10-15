import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IlluConversation } from 'assets/icons/icons';
import { ButtonIcon, ButtonIconProps } from './ButtonIcon';

const meta = {
  title: 'ButtonIcon',
  render: ({ tooltip, href, newTab }: ButtonIconProps) => {
    return (
      <>
        Bouton vers : {href}
        <ButtonIcon
          icon={<IlluConversation />}
          tooltip={tooltip}
          href={href}
          newTab={newTab}
        />
      </>
    );
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof ButtonIcon>;

export const Default: Story = {
  args: {
    tooltip: "Contenu de l'infobulle",
    href: 'https://www.entourage.social/',
    newTab: true,
  },
};
