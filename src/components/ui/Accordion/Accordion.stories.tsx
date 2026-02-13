import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Accordion, AccordionProps } from './Accordion';

const Template = (args: AccordionProps) => (
  <div style={{ maxWidth: 720 }}>
    <Accordion {...args} />
  </div>
);

const meta = {
  component: Accordion,
  render: Template,
  args: {
    headerContent: 'Titre de l’accordéon',
    children: (
      <div>
        Contenu de l’accordéon. Tu peux mettre ici du texte, des liens, des
        composants, etc.
      </div>
    ),
    variant: 'default',
    defaultOpen: false,
  },
  argTypes: {
    headerContent: {
      control: false,
      description: 'Contenu du header (ex: titre, icône, etc).',
    },
    children: {
      control: false,
      description: "Contenu affiché quand l'accordéon est ouvert.",
    },
    variant: {
      control: { type: 'radio' },
      options: ['default', 'simple'],
      description: 'Variante visuelle de l’accordéon.',
    },
    defaultOpen: {
      control: 'boolean',
      description: "Définit si l'accordéon est ouvert par défaut.",
    },
  },
  parameters: {
    controls: { expanded: true },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

export const DefaultClosed: Story = {
  name: 'Default (fermé)',
};

export const DefaultOpen: Story = {
  name: 'Default (ouvert)',
  args: {
    defaultOpen: true,
  },
};

export const SimpleClosed: Story = {
  name: 'Simple (fermé)',
  args: {
    variant: 'simple',
  },
};

export const SimpleOpen: Story = {
  name: 'Simple (ouvert)',
  args: {
    variant: 'simple',
    defaultOpen: true,
  },
};

export const LongContent: Story = {
  name: 'Contenu long',
  args: {
    defaultOpen: true,
    children: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          pharetra, nisl at convallis pretium, turpis purus volutpat leo, a
          consequat libero ipsum a justo.
        </p>
        <p>
          Integer non viverra elit. Aliquam erat volutpat. Sed in sem ut urna
          luctus pulvinar.
        </p>
      </div>
    ),
  },
};
